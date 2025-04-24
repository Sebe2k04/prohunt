"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaEdit, FaTrash, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaLayerGroup } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import data from "../../create/skills.json";
import domainData from "../../create/domains.json";

export default function EditProject() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredSkillsQuery, setRequiredSkillsQuery] = useState("");
  const [preferredSkillsQuery, setPreferredSkillsQuery] = useState("");
  const [projectDomainQuery, setProjectDomainQuery] = useState("");
  const Allsuggestions = data.skills;
  const AllDomainsuggestions = domainData.domains;
  
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    required_skills: [],
    preferred_skills: [],
    domain: "",
    complexity: "Medium",
    location: "",
    compensation_type: "Price",
    budget_range: "",
    timeline: "",
    status: "Open",
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!user) {
        toast.error("You must be logged in to edit a project");
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
        
        if (data.created_by !== user.id) {
          toast.error("You don't have permission to edit this project");
          router.push("/secure/project");
          return;
        }
        
        setProjectData({
          name: data.name || "",
          description: data.description || "",
          required_skills: data.required_skills || [],
          preferred_skills: data.preferred_skills || [],
          domain: data.domain || "",
          complexity: data.complexity || "Medium",
          location: data.location || "",
          compensation_type: data.compensation_type || "Price",
          budget_range: data.budget_range || "",
          timeline: data.timeline || "",
          status: data.status || "Open",
        });
        
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

  const filteredRequiredSuggestions = Allsuggestions.filter((item) =>
    item.toLowerCase().includes(requiredSkillsQuery.toLowerCase())
  ).slice(0, 10);

  const filteredPreferredSuggestions = Allsuggestions.filter((item) =>
    item.toLowerCase().includes(preferredSkillsQuery.toLowerCase())
  ).slice(0, 10);

  const filteredProjectDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(projectDomainQuery.toLowerCase())
  ).slice(0, 10);

  const handleSelect = (item, type) => {
    if (type === 'required') {
      setRequiredSkillsQuery("");
      setProjectData({
        ...projectData,
        required_skills: [...projectData.required_skills, item],
      });
    } else if (type === 'preferred') {
      setPreferredSkillsQuery("");
      setProjectData({
        ...projectData,
        preferred_skills: [...projectData.preferred_skills, item],
      });
    }
  };

  const handleRemoveSkill = (item, type) => {
    if (type === 'required') {
      setProjectData({
        ...projectData,
        required_skills: projectData.required_skills.filter(skill => skill !== item),
      });
    } else if (type === 'preferred') {
      setProjectData({
        ...projectData,
        preferred_skills: projectData.preferred_skills.filter(skill => skill !== item),
      });
    }
  };

  const handleDomainSelect = (item) => {
    setProjectDomainQuery("");
    setProjectData({
      ...projectData,
      domain: item,
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setProjectData({
      ...projectData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update a project");
      return;
    }
    
    if (!projectData.name || !projectData.description || !projectData.domain) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (projectData.required_skills.length === 0) {
      toast.error("Please add at least one required skill");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...projectData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Project updated successfully!");
      router.push("/secure/project");
      
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="lg:px-10 px-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
          Edit{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
            Project
          </span>
        </h1>
        <Link href="/secure/project" className="bg-green-700 text-white py-1.5 px-5 text-[12px] rounded-[6px] hover:bg-green-800 transition-colors">Back to Projects</Link>
      </div>
      <h5 className="text-sm pt-2">
        Update your project details and requirements.
      </h5>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 max-w-[800px] gap-5 pt-5 text-sm">
        <div className="grid gap-1">
          <label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Project Name *</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={projectData.name}
              placeholder="Enter your Project Name"
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaLayerGroup />
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="domain" className="font-medium text-gray-700 dark:text-gray-300">Project Domain *</label>
          <div className="relative">
            <input
              type="text"
              id="domain"
              value={projectDomainQuery}
              onChange={(e) => setProjectDomainQuery(e.target.value)}
              placeholder="Search for domain..."
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaSearch />
            </div>
            {projectDomainQuery && filteredProjectDomainSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                {filteredProjectDomainSuggestions.map((domain) => (
                  <div
                    key={domain}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer"
                    onClick={() => handleDomainSelect(domain)}
                  >
                    {domain}
                  </div>
                ))}
              </div>
            )}
          </div>
          {projectData.domain && (
            <div className="mt-2 flex items-center gap-2">
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs">
                {projectData.domain}
              </span>
              <button
                type="button"
                onClick={() => setProjectData({...projectData, domain: ""})}
                className="text-red-500 hover:text-red-700"
              >
                <IoClose />
              </button>
            </div>
          )}
        </div>
        
        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="description" className="font-medium text-gray-700 dark:text-gray-300">Project Description *</label>
          <textarea
            id="description"
            value={projectData.description}
            onChange={handleInputChange}
            className="bg-inherit w-full min-h-[120px] border-green-700 border rounded-md py-2 px-5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            placeholder="Describe your project in detail..."
            required
          ></textarea>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="complexity" className="font-medium text-gray-700 dark:text-gray-300">Complexity</label>
          <div className="relative">
            <select
              id="complexity"
              value={projectData.complexity}
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaLayerGroup />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="location" className="font-medium text-gray-700 dark:text-gray-300">Location</label>
          <div className="relative">
            <input
              type="text"
              id="location"
              value={projectData.location}
              placeholder="Remote, New York, etc."
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaMapMarkerAlt />
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="compensation_type" className="font-medium text-gray-700 dark:text-gray-300">Compensation Type</label>
          <div className="relative">
            <select
              id="compensation_type"
              value={projectData.compensation_type}
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Price">Price</option>
              <option value="Equity">Equity</option>
              <option value="Revenue Share">Revenue Share</option>
              <option value="Unpaid">Unpaid</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaDollarSign />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="budget_range" className="font-medium text-gray-700 dark:text-gray-300">Budget Range</label>
          <div className="relative">
            <input
              type="text"
              id="budget_range"
              value={projectData.budget_range}
              placeholder="e.g., $1000-$5000"
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaDollarSign />
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="timeline" className="font-medium text-gray-700 dark:text-gray-300">Timeline</label>
          <div className="relative">
            <input
              type="text"
              id="timeline"
              value={projectData.timeline}
              placeholder="e.g., 3 months"
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaClock />
            </div>
          </div>
        </div>
        
        <div className="grid gap-1">
          <label htmlFor="status" className="font-medium text-gray-700 dark:text-gray-300">Status</label>
          <div className="relative">
            <select
              id="status"
              value={projectData.status}
              onChange={handleInputChange}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaCalendarAlt />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="required_skills" className="font-medium text-gray-700 dark:text-gray-300">Required Skills *</label>
          {projectData.required_skills.length > 0 && (
            <div className="py-2 flex flex-wrap gap-2">
              {projectData.required_skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1 border gap-2 rounded-md border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill, 'required')}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              value={requiredSkillsQuery}
              onChange={(e) => setRequiredSkillsQuery(e.target.value)}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Search for required skills..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaSearch />
            </div>
            {requiredSkillsQuery && filteredRequiredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                {filteredRequiredSuggestions.map((skill) => (
                  <div
                    key={skill}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSelect(skill, 'required')}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="preferred_skills" className="font-medium text-gray-700 dark:text-gray-300">Preferred Skills (Optional)</label>
          {projectData.preferred_skills.length > 0 && (
            <div className="py-2 flex flex-wrap gap-2">
              {projectData.preferred_skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-1 border gap-2 rounded-md border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill, 'preferred')}
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <IoClose />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              value={preferredSkillsQuery}
              onChange={(e) => setPreferredSkillsQuery(e.target.value)}
              className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Search for preferred skills..."
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
              <FaSearch />
            </div>
            {preferredSkillsQuery && filteredPreferredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                {filteredPreferredSuggestions.map((skill) => (
                  <div
                    key={skill}
                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors duration-200"
                    onClick={() => handleSelect(skill, 'preferred')}
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-2 flex justify-end mt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-6 rounded-md hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : "Update Project"}
          </button>
        </div>
      </form>
    </div>
  );
} 