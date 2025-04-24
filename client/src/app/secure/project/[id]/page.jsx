"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaLayerGroup, FaUser, FaEnvelope, FaGlobe, FaPhone, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  
  useEffect(() => {
    const fetchProject = async () => {
      if (!user) {
        toast.error("You must be logged in to view project details");
        router.push("/login");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          toast.error("Project not found");
          router.push("/secure/project");
          return;
        }
        
        setProject(data);
        
        // Fetch creator details
        const { data: creatorData, error: creatorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.created_by)
          .single();
        
        if (creatorError) throw creatorError;
        
        setCreator(creatorData);
        
      } catch (error) {
        console.error("Error fetching project:", error);
        toast.error("Failed to fetch project. Please try again.");
        router.push("/secure/project");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProject();
  }, [id, user, router]);
  
  const handleDelete = async () => {
    if (!user) {
      toast.error("You must be logged in to delete a project");
      return;
    }
    
    if (project.created_by !== user.id) {
      toast.error("You don't have permission to delete this project");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Project deleted successfully!");
      router.push("/secure/project");
      
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Project not found</h1>
        <Link href="/secure/project" className="bg-green-700 text-white py-2 px-5 rounded-md hover:bg-green-800 transition-colors">
          Back to Projects
        </Link>
      </div>
    );
  }
  
  const isOwner = user && project.created_by === user.id;
  
  return (
    <div className="lg:px-10 px-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
          Project{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
            Details
          </span>
        </h1>
        <div className="flex gap-3">
          <Link href="/secure/project" className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-1.5 px-5 text-[12px] rounded-[6px] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
            Back to Projects
          </Link>
          {isOwner && (
            <>
              <Link href={`/secure/project/edit/${id}`} className="bg-green-700 text-white py-1.5 px-5 text-[12px] rounded-[6px] hover:bg-green-800 transition-colors flex items-center gap-2">
                <FaEdit /> Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 text-white py-1.5 px-5 text-[12px] rounded-[6px] hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  <>
                    <FaTrash /> Delete
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Project Details */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{project.name}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.status === 'Open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                project.status === 'Completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {project.status}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {project.complexity}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-line">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{project.location || 'Remote'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{project.compensation_type} {project.budget_range ? `(${project.budget_range})` : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{project.timeline || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaLayerGroup className="text-green-600 dark:text-green-400" />
                <span className="text-gray-700 dark:text-gray-300">{project.domain}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {project.required_skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              {project.preferred_skills && project.preferred_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Preferred Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.preferred_skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Project Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Project Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                  <p className="text-gray-800 dark:text-white">{new Date(project.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-800 dark:text-white">{new Date(project.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Creator Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 h-fit"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Project Creator</h2>
          
          {creator ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {creator.avatar_url ? (
                    <img src={creator.avatar_url} alt={creator.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <FaUser size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{creator.full_name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{creator.title || 'No title provided'}</p>
                </div>
              </div>
              
              {creator.bio && (
                <p className="text-gray-600 dark:text-gray-300 text-sm">{creator.bio}</p>
              )}
              
              <div className="space-y-2">
                {creator.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-green-600 dark:text-green-400" />
                    <a href={`mailto:${creator.email}`} className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {creator.email}
                    </a>
                  </div>
                )}
                
                {creator.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaGlobe className="text-green-600 dark:text-green-400" />
                    <a href={creator.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {creator.website}
                    </a>
                  </div>
                )}
                
                {creator.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaPhone className="text-green-600 dark:text-green-400" />
                    <a href={`tel:${creator.phone}`} className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {creator.phone}
                    </a>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-2">
                {creator.github_url && (
                  <a href={creator.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <FaGithub size={20} />
                  </a>
                )}
                {creator.linkedin_url && (
                  <a href={creator.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {creator.twitter_url && (
                  <a href={creator.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <FaTwitter size={20} />
                  </a>
                )}
              </div>
              
              <Link
                href={`/secure/profile/${creator.id}`}
                className="block w-full text-center bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors mt-4"
              >
                View Full Profile
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Creator profile not available</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 