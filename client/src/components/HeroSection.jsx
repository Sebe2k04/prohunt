"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";

const getSkillIcon = (skill) => {
  const skillLower = skill.toLowerCase();
  if (skillLower.includes('react')) return '⚛️';
  if (skillLower.includes('node')) return '🟢';
  if (skillLower.includes('python')) return '🐍';
  if (skillLower.includes('java')) return '☕';
  if (skillLower.includes('aws')) return '☁️';
  if (skillLower.includes('docker')) return '🐳';
  if (skillLower.includes('kubernetes')) return '⎈';
  if (skillLower.includes('typescript')) return '📘';
  if (skillLower.includes('javascript')) return '📜';
  if (skillLower.includes('html')) return '🌐';
  if (skillLower.includes('css')) return '🎨';
  if (skillLower.includes('sql')) return '💾';
  if (skillLower.includes('git')) return '📦';
  return '💻';
};

export default function HeroSection({ userData }) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const skills = userData?.skills || [];

  useEffect(() => {
    if (skills.length > 0) {
      const interval = setInterval(() => {
        setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [skills]);

  return (
    <div className="">
      <div className="flex justify-center text-[12px] py-5">
        <div className=" flex gap-2 dark:shadow-md border border-green-800  dark:shadow-gray-800/50 shadow-green-800 items-center dark:border-t dark:border-gray-900 p-1.5 pr-3 rounded-full">
          <div className="px-3 py-1 bg-green-900/70 text-white dark:text-inherit border rounded-full border-green-800 ">
            Hire Me
          </div>
          <Link href={"/"} className="flex gap-2 items-center hover:opacity-70">
            Learn More
            <FaArrowRight />
          </Link>
        </div>
      </div>
      <div className="relative min-h-[70vh] bg-[#121212] flex items-center justify-center px-4">
        <div className="flex justify-center">
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
                I'm{" "}
                <span className="text-green-500">
                  {userData?.name || "Michael Anderson"}
                </span>
              </h1>
              <p className="text-gray-400 text-md md:text-md max-w-2xl mb-8">
                {userData?.bio ||
                  "I write code not merely to execute tasks, but to create meaningful experiences. Every function I craft is a solution to a challenge; every feature I build tells a story of innovation and intent. To me, development isn't just about syntax and logic—it's about empathy, design, and purpose. Through each line of code, I shape digital experiences that aim to inspire, empower, and impact lives. This is my way of contributing to the future—one project, one problem, one breakthrough at a time."}
              </p>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
                  Contact me
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4">
        <div className="text-gray-400 flex items-center gap-5">
          <span className="text-white font-semibold">Skilled in: </span>
          <div className="inline-flex items-center gap-2 pt-1">
            <div className="relative h-8 overflow-hidden min-w-[150px]">
              {skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: index === currentSkillIndex ? 1 : 0,
                    y: index === currentSkillIndex ? 0 : 20,
                    display: index === currentSkillIndex ? 'flex' : 'none'
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute left-0 top-0 flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-green-500">
                    {getSkillIcon(skill)} {skill}
                  </span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
