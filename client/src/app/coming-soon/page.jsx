"use client";
import { motion } from "framer-motion";
import { FaRocket, FaCode, FaTools, FaLightbulb, FaArrowLeft, FaClock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export default function ComingSoon() {
  const features = [
    {
      icon: <FaRocket className="w-6 h-6" />,
      title: "Fast Development",
      description: "Building with cutting-edge technologies"
    },
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Clean Code",
      description: "Writing maintainable and scalable code"
    },
    {
      icon: <FaTools className="w-6 h-6" />,
      title: "Modern Tools",
      description: "Using the latest development tools"
    },
    {
      icon: <FaLightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "Creating unique solutions"
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}


      {/* Main Content */}
      <div className="">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 text-green-500 rounded-full mb-6">
                  <FaClock className="w-4 h-4" />
                  <span className="text-sm font-medium">Coming Soon</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
                    Feature Coming Soon
                  </span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                  We're working hard to bring you something amazing. Stay tuned!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-900 shadow-lg shadow-green-500/5 hover:border-green-600/50 transition-colors"
                  >
                    <div className="text-green-500 mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex justify-center gap-4"
              >
                <Link
                  href="/"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 