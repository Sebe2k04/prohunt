"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaGlobe, FaMapMarkerAlt, FaPhone, FaCode, FaLaptopCode, FaProjectDiagram } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { BsBriefcase, BsCalendarCheck, BsStar } from "react-icons/bs";
import { IoCodeSlash } from "react-icons/io5";
import { motion } from "framer-motion";

export default function Page() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setUserData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-inherit">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-inherit">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Profile not found</h2>
          <p className="text-green-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-10 px-8 py-8 bg-inherit min-h-screen">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white dark:from-white dark:to-white/70">
          My{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50 dark:from-green-400 dark:to-white/70">
            Profile
          </span>
        </h1>
        <Link 
          href="/secure/profile/edit" 
          className="bg-gradient-to-br from-green-500 via-green-600 to-green-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <span>Edit Profile</span>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 group">
                {userData.avatar_url ? (
                  <img
                    src={userData.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover border-4 border-green-500 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-4 border-green-500 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-4xl text-green-500">👤</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-gray-900/40 dark:bg-black/40 group-hover:opacity-0 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm">View Profile</span>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{userData.user_name || 'Anonymous'}</h2>
              <p className="text-green-500 mt-1 text-center">{userData.bio || 'No bio available'}</p>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 w-full mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{userData.projects?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{userData.skills?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{userData.certifications?.length || 0}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Certs</div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="w-full mt-6 space-y-3">
                {userData.location && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-300"
                  >
                    <FaMapMarkerAlt className="text-green-500" />
                    <span>{userData.location}</span>
                  </motion.div>
                )}
                {userData.website && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <FaGlobe className="text-green-500" />
                    <a href={userData.website} target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors duration-300">
                      {userData.website}
                    </a>
                  </motion.div>
                )}
                {userData.phone && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-green-500 transition-colors duration-300"
                  >
                    <FaPhone className="text-green-500" />
                    <span>{userData.phone}</span>
                  </motion.div>
                )}
              </div>

              {/* Social Links */}
              <div className="flex gap-4 mt-6">
                {userData.social_media?.github && (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    href={userData.social_media.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaGithub size={24} />
                  </motion.a>
                )}
                {userData.social_media?.linkedin && (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    href={userData.social_media.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaLinkedin size={24} />
                  </motion.a>
                )}
                {userData.social_media?.twitter && (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    href={userData.social_media.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaTwitter size={24} />
                  </motion.a>
                )}
                {userData.social_media?.facebook && (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.0 }}
                    href={userData.social_media.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaFacebook size={24} />
                  </motion.a>
                )}
                {userData.social_media?.instagram && (
                  <motion.a 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.1 }}
                    href={userData.social_media.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-600 dark:text-gray-300 hover:text-green-500 transition-all duration-300 transform hover:scale-110"
                  >
                    <FaInstagram size={24} />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <IoCodeSlash className="text-green-500" />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills?.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Preferred Domains Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BsBriefcase className="text-green-500" />
              Preferred Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {userData.preferred_domains?.map((domain, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-300"
                >
                  {domain}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Projects and Certifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaProjectDiagram className="text-green-500" />
              Projects
            </h3>
            <div className="grid gap-6">
              {userData.projects?.map((project, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-4 rounded-lg transition-colors duration-300"
                >
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{project.description}</p>
                  <div className="flex gap-4 mt-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 transition-colors duration-300 flex items-center gap-1"
                      >
                        <span>Live Demo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 transition-colors duration-300 flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                  {project.domain && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-300">
                      {project.domain}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Certifications Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AiFillSafetyCertificate className="text-green-500" />
              Certifications
            </h3>
            <div className="grid gap-4">
              {userData.certifications?.map((cert, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors duration-300"
                >
                  <span className="text-gray-900 dark:text-white">{cert.name}</span>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-600 transition-colors duration-300 flex items-center gap-1"
                    >
                      <span>View Certificate</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BsCalendarCheck className="text-green-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Updated profile information</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">2 days ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Added new project: {userData.projects?.[0]?.name || 'Project'}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">1 week ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                <div>
                  <p className="text-gray-900 dark:text-white">Earned new certification</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">2 weeks ago</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
