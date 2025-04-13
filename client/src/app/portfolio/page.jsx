"use client";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiPython,
  SiGit,
  SiFigma,
  SiAdobexd,
} from "react-icons/si";
import { useEffect, useState } from "react";

const skills = [
  {
    name: "React",
    icon: <SiReact className="text-blue-500" />,
  },
  {
    name: "Next.js",
    icon: <SiNextdotjs />,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-500" />,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600" />,
  },
  {
    name: "JavaScript",
    icon: <SiJavascript className="text-yellow-500" />,
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs className="text-green-600" />,
  },
  {
    name: "Python",
    icon: <SiPython className="text-blue-800" />,
  },
  {
    name: "Git",
    icon: <SiGit className="text-orange-600" />,
  },
];

const heroSkills = [
  <SiReact key="react" className="text-blue-500" />,
  <SiNextdotjs key="next" />,
  <SiTailwindcss key="tailwind" className="text-cyan-500" />,
  <SiTypescript key="typescript" className="text-blue-600" />,
  <SiJavascript key="javascript" className="text-yellow-500" />,
  <SiNodedotjs key="node" className="text-green-600" />,
  <SiFigma key="figma" />,
  <SiAdobexd key="adobexd" className="text-pink-600" />,
];

export default function Page() {
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSkillIndex((prevIndex) => (prevIndex + 1) % heroSkills.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-20 lg:px-20">
      <div className="flex justify-center text-[12px]">
        <div className=" flex gap-2 dark:shadow-md border border-green-800  dark:shadow-gray-800/50 shadow-green-800 items-center dark:border-t dark:border-gray-900 p-1.5 pr-3 rounded-full">
          <div className="px-3 py-1 bg-green-900/70 text-white dark:text-inherit border rounded-full border-green-800 ">
            Hire Me
          </div>
          <Link href={"/"} className="flex gap-2 items-center hover:opacity-70">
            Learn More
            <FaArrowRight />
          </Link>
        </div>
      </div>{" "}
      <div className="grid grid-cols-2 min-h-[50vh]">
        <div className="flex justify-center items-center">
          <div className="border-8 border-green-600 p-1 rounded-full">
            <Image
              src="/pheroimg.png"
              width="500"
              height="500"
              alt="portfolio"
              className=" rounded-full border-4 border-green-700 w-[300px]"
            />
          </div>
        </div>

        <div className="flex items-center">
          <div className="">
            <div className="">
              <h1 className="text-2xl text-white font-semibold">
                I&apos;m{" "}
                <span className="text-green-600">Michael Anderson</span>
              </h1>
              <p className="max-w-[500px]">
                I write code to create, not just to execute. Every function
                solves a problem; every feature tells a story. Building digital
                experiences is my way of shaping the future
              </p>
            </div>
            <div className="flex gap-2 text-sm pt-5">
              <Link
                href={"/"}
                className="text-white bg-green-800 px-5 py-1.5 rounded-lg"
              >
                Contact me
              </Link>
              <div className=" p-1 border border-green-800 text-green-800 text-xl rounded-md">
                <CiHeart />
              </div>
            </div>
           
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-6 h-6 overflow-hidden">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-2">Skilled in:</span>
                <div className="h-6 overflow-hidden relative w-32">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="absolute transition-transform duration-500 flex items-center gap-1 font-medium text-green-800 dark:text-green-400"
                      style={{
                        transform: `translateY(${
                          100 * (index - (activeSkillIndex % skills.length))
                        }%)`,
                        opacity:
                          index === activeSkillIndex % skills.length ? 1 : 0.5,
                      }}
                    >
                      {skill.icon} {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
      <div className="flex justify-center pt-10 items-center">
        <div className="border-t-2 border-green-400 w-[300px]"></div>
      </div>
    </div>
  );
}
