"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { FaUserFriends, FaStar, FaCode, FaCertificate, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTwitter } from "react-icons/fa";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiArrowRight } from "react-icons/fi";

export default function RecommendPage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [projectData, setProjectData] = useState(null);
  const [error, setError] = useState(null);
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
          const { data: { user } } = await supabase.auth.getUser();
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
        const dataToSend = projectToUse ? {
          project_id: parseInt(projectToUse.id.replace(/-/g, '').substring(0, 3)) || Math.floor(Math.random() * 1000),
          project_name: projectToUse.name,
          required_skills: Array.isArray(projectToUse.required_skills) ? projectToUse.required_skills : [],
          preferred_skills: Array.isArray(projectToUse.preferred_skills) ? projectToUse.preferred_skills : [],
          complexity: projectToUse.complexity || "Medium",
          location: projectToUse.location || "Remote",
          shift: projectToUse.shift || "Day",
          compensation_type: projectToUse.compensation_type || "Price",
          domain: projectToUse.domain || "Software Development"
        } : {
          project_id: 100,
          project_name: "Default Project",
          required_skills: ["Python", "JavaScript"],
          preferred_skills: ["React", "Node.js"],
          complexity: "Medium",
          location: "Remote",
          shift: "Day",
          compensation_type: "Price",
          domain: "Software Development"
        };

        console.log("Sending data to recommendation API:", dataToSend);

        // Get recommendations from API with timeout
        const response = await Promise.race([
          axios.post("http://localhost:5000/recommend", dataToSend),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Request timeout")), 10000)
          )
        ]);
        
        console.log("Received response from recommendation API:", response.data);
        
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid response from recommendation service");
        }

        // Transform the recommendations while preserving original data
        const transformedRecommendations = response.data
          .filter(user => user && user.user_id && user.name)
          .map(user => ({
            id: user.user_id,
            name: user.name,
            skills: Array.isArray(user.skills) ? user.skills : [],
            match_score: typeof user.predicted_score === 'number' ? user.predicted_score : 0,
            certifications: Array.isArray(user.certifications) ? user.certifications : [],
            location: user.location || "Remote",
            availability: user.availability || "Available",
            projects_completed: parseInt(user.projects_completed) || 0,
            feedback: parseFloat(user.feedback) || 0,
            social: {
              github: user.github || "",
              linkedin: user.linkedin || "",
              twitter: user.twitter || ""
            }
          }));

        if (transformedRecommendations.length === 0) {
          throw new Error("No matching recommendations found for your project requirements");
        }
        
        setProjectData(projectToUse);
        setRecommendations(transformedRecommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        let errorMessage = "Failed to fetch recommendations";
        
        if (error.response?.status === 500) {
          errorMessage = "The recommendation service is currently unavailable. Please try again later.";
        } else if (error.message === "Request timeout") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndRecommendations();
  }, [projectId]);

  const handleViewProfile = (user) => {
    // Pass the entire user object through router state
    router.push(`/portfolio?userId=${user.id}`, {
      state: { userData: user }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recommended Team Members
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Find the perfect team members for your project
            </p>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center min-h-[400px]"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
            >
              {error}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendations.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.location || "Location not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {(user.match_score * 100).toFixed(1)}% Match
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Certifications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {user.certifications.map((cert, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {user.projects_completed} projects completed
                          </span>
                        </div>
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <span>View Profile</span>
                          <FiArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Recommended Team Members
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find the perfect team members for your project
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-[400px]"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </motion.div>
        ) : recommendations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No recommendations found. Try adjusting your project requirements.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.location || "Location not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        {(user.match_score * 100).toFixed(1)}% Match
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {user.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {user.projects_completed} projects completed
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewProfile(user)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                      >
                        <span>View Profile</span>
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
