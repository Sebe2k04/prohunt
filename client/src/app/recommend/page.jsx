"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [activeTab, setActiveTab] = useState("recommendations");
  const searchParams = useSearchParams();
const router = useRouter();
const projectId = searchParams.get("projectId");

useEffect(() => {
  const fetchProjectAndRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let projectToUse = null;

      // If projectId is provided, fetch project data from Supabase
      if (projectId) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Please sign in to view recommendations");
        }

        const { data: project, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", projectId)
          .eq("created_by", user.id)
          .single();

        if (projectError) throw projectError;
        if (!project) throw new Error("Project not found");

        projectToUse = project;
      }

      // Prepare project data for recommendation API
      const dataToSend = projectToUse
        ? {
            project_id: Math.floor(Math.random() * (201 - 100)) + 100,
            project_name: projectToUse.name,
            required_skills: Array.isArray(projectToUse.required_skills)
              ? projectToUse.required_skills
              : [],
            preferred_skills: Array.isArray(projectToUse.preferred_skills)
              ? projectToUse.preferred_skills
              : [],
            complexity: projectToUse.complexity || "Medium",
            location: projectToUse.location || "Remote",
            shift: projectToUse.shift || "Day",
            compensation_type: projectToUse.compensation_type || "Price",
            domain: projectToUse.domain || "Software Development",
          }
        : {
              project_id: 101,
              project_name: "AI Chatbot Development",
              required_skills: ["Python"],
              preferred_skills: ["React", "JavaScript"],
              complexity: "High",
              location: "New York",
            shift: "Day",
            compensation_type: "Price",
              domain: "AI",
            };

        // Get recommendations from API using axios
        const response = await axios.post(
          "http://localhost:5000/recommend",
          dataToSend
        );

        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response from recommendation service");
        }

      // Transform the recommendations while preserving original data
        const transformedRecommendations = response.data
          .filter((user) => user && user.user_id && user.name)
          .map((user) => ({
            id: user.user_id,
            name: user.name,
            skills: Array.isArray(user.skills) ? user.skills : [],
            match_score:
              typeof user.predicted_score === "number"
                ? user.predicted_score
                : 0,
            certifications: Array.isArray(user.certifications)
              ? user.certifications
              : [],
            location: user.location || "Remote",
            availability: user.availability || "Available",
            projects_completed: parseInt(user.projects_completed) || 0,
            feedback: parseFloat(user.feedback) || 0,
            social: {
              github: user.github || "",
              linkedin: user.linkedin || "",
              twitter: user.twitter || "",
            },
          }));

        if (transformedRecommendations.length === 0) {
          throw new Error(
            "No matching recommendations found for your project requirements"
          );
        }

        setProjectData(dataToSend);
        setUsers(transformedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
        setError(error.message);
        toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProjectAndRecommendations();
}, [projectId]);

const handleViewProfile = (user) => {
    // Store the project data in localStorage
    localStorage.setItem(
      "currentProject",
      JSON.stringify({
        projectData,
        userData: user,
      })
    );

    // Navigate to portfolio page
    router.push(`/portfolio?userId=${user.id}`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen dark:bg-[#121212]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-600 font-medium">Finding the perfect match for your project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen dark:bg-[#121212] text-white">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-2xl font-semibold text-red-400 mb-2">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-[#121212] text-gray-700 dark:text-gray-400">
      {/* Header with animated background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative lg:px-20 px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white dark:from-white dark:to-white/70">
              Recommended{" "}
              <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50 dark:from-green-400 dark:to-white/70">
                Users
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
              Find the perfect match for your project requirements
            </p>
            
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg bg-gray-800/50 p-1 backdrop-blur-sm">
                <button
                  onClick={() => setActiveTab("recommendations")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "recommendations"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Recommendations
                </button>
                <button
                  onClick={() => setActiveTab("trending")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "trending"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Trending Skills
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "stats"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Statistics
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="lg:px-20 px-8 pb-12">
      <div className="grid grid-cols-3 gap-5">
          {/* Project Requirements Card */}
          <motion.div 
            className="relative p-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-5 sticky top-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-900 shadow-lg shadow-green-500/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-xl text-white">Project Requirements</h2>
                  <p className="text-gray-400 text-sm">Based on your project criteria</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-green-600 text-sm font-medium">Project Name</h3>
                  <p className="text-white">{projectData?.project_name}</p>
                </div>
                
                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-green-600 text-sm font-medium">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projectData?.required_skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-green-600 text-sm font-medium">Preferred Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {projectData?.preferred_skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-green-900/30 text-green-400 rounded-md text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                    <h3 className="text-green-600 text-sm font-medium">Complexity</h3>
                    <p className="text-white">{projectData?.complexity}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                    <h3 className="text-green-600 text-sm font-medium">Location</h3>
                    <p className="text-white">{projectData?.location}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                    <h3 className="text-green-600 text-sm font-medium">Shift</h3>
                    <p className="text-white">{projectData?.shift}</p>
                  </div>
                  <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                    <h3 className="text-green-600 text-sm font-medium">Compensation</h3>
                    <p className="text-white">{projectData?.compensation_type}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/40 transition-colors">
                  <h3 className="text-green-600 text-sm font-medium">Domain</h3>
                  <p className="text-white">{projectData?.domain}</p>
                </div>
                
                <div className="pt-4">
                  <div className="px-4 py-2 bg-gradient-to-br from-green-500 via-green-600 to-green-800 font-semibold rounded-lg border border-green-600 text-white text-center cursor-pointer hover:opacity-90 transition-opacity">
                    See More Details
                  </div>
                </div>
              </div>
              
              {/* Static content for additional info */}
              <div className="mt-6 pt-6 border-t border-gray-900">
                <h3 className="text-green-600 text-sm font-medium mb-3">Project Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Match Quality</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="ml-2 text-green-400 text-sm">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Skill Coverage</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="ml-2 text-green-400 text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Experience Level</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="ml-2 text-green-400 text-sm">78%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* User Recommendations */}
          <motion.div 
            className="col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {activeTab === "recommendations" && (
              <motion.div 
                className="grid gap-4 py-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
            {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <motion.div
                      key={user.id}
                      variants={itemVariants}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl overflow-hidden hover:border-green-600/50 transition-colors shadow-lg shadow-green-500/5"
                    >
                      <div className="p-5 flex justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-xl font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold text-white">{user.name}</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {user.skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {user.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {user.availability}
                              </div>
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {user.projects_completed} projects
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="flex items-center gap-1 bg-green-900/30 px-3 py-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="text-green-400 font-medium">{user.feedback}</span>
                          </div>
                          <div
                            onClick={() => handleViewProfile(user)}
                            className="px-4 py-2 bg-gradient-to-br from-green-500 via-green-600 to-green-800 font-semibold rounded-lg border border-green-600 text-white cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            View Profile
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-medium text-white">No recommendations found</h3>
                    <p className="text-gray-400 mt-2">Try adjusting your project requirements</p>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Trending Skills Tab */}
            {activeTab === "trending" && (
              <motion.div 
                className="grid grid-cols-2 gap-4 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-4">Most In-Demand Skills</h3>
                  <div className="space-y-4">
                    {["Python", "JavaScript", "React", "Node.js", "AWS"].map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center">
                            <span className="text-green-400 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-white">{skill}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-green-400 text-sm">+{Math.floor(Math.random() * 20) + 10}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-4">Emerging Technologies</h3>
                  <div className="space-y-4">
                    {["AI/ML", "Blockchain", "IoT", "AR/VR", "Quantum Computing"].map((tech, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-900/30 flex items-center justify-center">
                            <span className="text-green-400 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-white">{tech}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span className="text-green-400 text-sm">+{Math.floor(Math.random() * 30) + 15}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5 col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4">Skill Distribution</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Frontend</span>
                        <span className="text-green-400">32%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Backend</span>
                        <span className="text-green-400">45%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">DevOps</span>
                        <span className="text-green-400">23%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Statistics Tab */}
            {activeTab === "stats" && (
              <motion.div 
                className="grid grid-cols-2 gap-4 py-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-4">Project Statistics</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Completed Projects</span>
                        <span className="text-green-400">1,245</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Active Projects</span>
                        <span className="text-green-400">328</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Success Rate</span>
                        <span className="text-green-400">92%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-4">User Statistics</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Total Users</span>
                        <span className="text-green-400">5,678</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Active Users</span>
                        <span className="text-green-400">3,245</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Average Rating</span>
                        <span className="text-green-400">4.7/5</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-700 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-900 rounded-xl p-5 col-span-2">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[
                      { user: "Sarah Johnson", action: "completed", project: "E-commerce Platform", time: "2 hours ago" },
                      { user: "Michael Chen", action: "started", project: "Mobile App Development", time: "5 hours ago" },
                      { user: "Emily Rodriguez", action: "updated", project: "AI Chatbot", time: "1 day ago" },
                      { user: "David Wilson", action: "completed", project: "Blockchain Integration", time: "2 days ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">
                          {activity.user.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="text-white">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.action} project{" "}
                            <span className="text-green-400">{activity.project}</span>
                          </p>
                          <p className="text-gray-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
