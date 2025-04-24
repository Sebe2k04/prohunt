"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function HeroSection({ userData }) {
  return (
    <div className="relative min-h-[80vh] bg-[#121212] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]/50"></div>
      
      {/* Top Navigation */}
      <div className="absolute top-4 right-4 flex gap-3">
        <Link 
          href="#" 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Hire Me
        </Link>
        <Link 
          href="#" 
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
        >
          Learn More
          <span className="text-sm">→</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-12 z-10">
        {/* Profile Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-64 h-64"
        >
          <div className="w-full h-full rounded-full border-4 border-green-500 p-2">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
              {userData?.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt={userData?.name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-green-500">
                  {userData?.name?.[0] || "M"}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            I'm <span className="text-green-500">{userData?.name || "Michael Anderson"}</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
            {userData?.bio || "I write code to create, not just to execute. Every function solves a problem; every feature tells a story. Building digital experiences is my way of shaping the future"}
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              Contact me
              <FaHeart className="text-sm" />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="text-gray-400">
                <span className="text-white font-semibold">Skilled in: </span>
                <span className="text-green-500">
                  {userData?.skills?.[0] || "Next.js"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 