"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaArrowRight, FaHeart } from "react-icons/fa";

export default function HeroSection({ userData }) {
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
      <div className="relative min-h-[80vh] bg-[#121212] flex items-center justify-center px-4">
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
              <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-8">
                {userData?.bio ||
                  "I write code to create, not just to execute. Every function solves a problem; every feature tells a story. Building digital experiences is my way of shaping the future"}
              </p>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm">
                  Contact me
                </button>

                <div className="flex items-center gap-4">
                  <div className="text-gray-400">
                    <span className="text-white font-semibold">
                      Skilled in:{" "}
                    </span>
                    <span className="text-green-500">
                      {userData?.skills?.[0] || "Next.js"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
