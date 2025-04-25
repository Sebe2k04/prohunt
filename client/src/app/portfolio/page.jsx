"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaCode,
  FaCertificate,
  FaTwitter,
} from "react-icons/fa";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { FiArrowLeft } from "react-icons/fi";
import HeroSection from "@/components/HeroSection";

export default function PortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  useEffect(() => {
    // Fetch data from localStorage
    const storedData = localStorage.getItem("currentProject");
    if (storedData) {
      const { projectData, userData } = JSON.parse(storedData);
      setUserData(userData);
      setLoading(false);
      console.log(userData);
    }
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400"
          >
            {error}
          </motion.div>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Recommendations</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#121212] dark:to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-gray-600 dark:text-gray-400">
              No user data available
            </p>
            <button
              onClick={handleGoBack}
              className="mt-4 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Recommendations</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <HeroSection userData={userData} />

      <div className="flex justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Skills Section */}
            {userData.skills && userData.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaCode className="mr-2 text-green-500" />
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-800 text-green-400 rounded-full border border-gray-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications Section */}
            {userData.certifications && userData.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaCertificate className="mr-2 text-green-500" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {userData.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-gray-800 text-green-400 rounded-full border border-gray-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {userData.completed_projects &&
              userData.completed_projects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 md:col-span-2"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    Completed Projects
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {userData.completed_projects.map((project, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                      >
                        <h4 className="font-medium text-white">
                          {project.name}
                        </h4>
                        {project.description && (
                          <p className="text-sm text-gray-400 mt-1">
                            {project.description}
                          </p>
                        )}
                        {project.technologies &&
                          project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {project.technologies.map((tech, techIndex) => (
                                <span
                                  key={techIndex}
                                  className="px-2 py-1 text-xs bg-gray-700 text-green-400 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
          </motion.div>

          <div className="mt-12 text-center text-sm">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Recommendations</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
