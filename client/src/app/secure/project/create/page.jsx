"use client";

/*
SQL Query to create the projects table in Supabase:

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  preferred_skills TEXT[] DEFAULT '{}',
  domain TEXT NOT NULL,
  complexity TEXT DEFAULT 'Medium',
  location TEXT,
  compensation_type TEXT DEFAULT 'Price',
  budget_range TEXT,
  timeline TEXT,
  status TEXT DEFAULT 'Open',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX projects_created_by_idx ON projects(created_by);
CREATE INDEX projects_domain_idx ON projects(domain);
CREATE INDEX projects_status_idx ON projects(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Allow users to view all projects
CREATE POLICY "Allow public read access" 
ON projects FOR SELECT 
USING (true);

-- Allow authenticated users to create their own projects
CREATE POLICY "Allow authenticated users to create projects" 
ON projects FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own projects
CREATE POLICY "Allow users to update their own projects" 
ON projects FOR UPDATE 
TO authenticated 
USING (auth.uid() = created_by);

-- Allow users to delete their own projects
CREATE POLICY "Allow users to delete their own projects" 
ON projects FOR DELETE 
TO authenticated 
USING (auth.uid() = created_by);

-- Create a view to join projects with user information
CREATE VIEW projects_with_users AS
SELECT 
  p.*,
  u.user_name,
  u.email,
  u.avatar_url,
  u.skills AS user_skills,
  u.bio AS user_bio,
  u.integrations AS user_integrations,
  u.preferred_domains AS user_preferred_domains
FROM 
  projects p
JOIN 
  auth.users au ON p.created_by = au.id
JOIN 
  profiles u ON au.id = u.id;
*/

import { useState, useEffect } from "react";
import data from "./skills.json";
import domainData from "./domains.json";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign, FaClock, FaLayerGroup } from "react-icons/fa";

export default function Page() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredSkillsQuery, setRequiredSkillsQuery] = useState("");
  const [preferredSkillsQuery, setPreferredSkillsQuery] = useState("");
  const [domainQuery, setDomainQuery] = useState("");
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
    created_by: user?.id || "",
    created_at: new Date().toISOString(),
  });

  const filteredRequiredSuggestions = Allsuggestions.filter((item) =>
    item.toLowerCase().includes(requiredSkillsQuery.toLowerCase())
  ).slice(0, 10);

  const filteredPreferredSuggestions = Allsuggestions.filter((item) =>
    item.toLowerCase().includes(preferredSkillsQuery.toLowerCase())
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
      toast.error("You must be logged in to create a project");
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
        .insert([
          {
            ...projectData,
            created_by: user.id,
            created_at: new Date().toISOString(),
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success("Project created successfully!");
      // Reset form or redirect
      setProjectData({
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
        created_by: user.id,
        created_at: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProjectDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(projectDomainQuery.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="lg:px-10 px-8 pb-10">
      <div className="flex justify-end">
        <Link href={"/"} className="bg-green-700 text-white py-1.5 px-5 text-[12px] rounded-[6px] hover:bg-green-800 transition-colors">Explore Projects</Link>
      </div>
      <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
        Create{" "}
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
          Project
        </span>
      </h1>
      <h5 className="text-sm pt-2">
        Here you can create a project to find the perfect collaborators for your ideas.
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
                Creating...
              </span>
            ) : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
