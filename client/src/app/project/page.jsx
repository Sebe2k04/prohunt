"use client";

import { useState } from "react";
import data from "./skills.json";
import domainData from "./domains.json";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import Link from "next/link";

export default function Page() {
  const [query, setQuery] = useState("");
  const [domainQuery, setDomainQuery] = useState("");
  const [projectDomainQuery, setProjectDomainQuery] = useState("");
  const Allsuggestions = data.skills;
  const AllDomainsuggestions = domainData.domains;
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    socialMedia: {
      twitter: "",
      facebook: "",
      instagram: "",
    },
    interests: [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    availability: false,
    preferred_domains: [],
  });
  const filteredSuggestions = Allsuggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  const handleSelect = (item) => {
    setQuery("");
    setUserData({
      ...userData,
      skills: [...userData.skills, item],
    });
  };
  const filteredDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(domainQuery.toLowerCase())
  ).slice(0, 10);
  const filteredProjectDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(projectDomainQuery.toLowerCase())
  ).slice(0, 10);
  const handleDomainSelect = (item) => {
    setDomainQuery("");
    setUserData({
      ...userData,
      preferred_domains: [...userData.preferred_domains, item],
    });
  };

  const handleAddCertifications = () => {
    setUserData({
      ...userData,
      certifications: [...userData.certifications, { name: "", url: "" }],
    });
  };
  const handleAddProjects = () => {
    setUserData({
      ...userData,
      projects: [
        ...userData.projects,
        { name: "", liveUrl: "", githubUrl: "", domain: "", description: "" },
      ],
    });
  };

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    let newValue;
    if (name === "switch") {
      newValue = checked;
    } else if (type === "number") {
      newValue = parseFloat(value);
    } else if (value === "true" || value === "false") {
      newValue = value === "true" ? true : false;
    } else {
      newValue = value;
    }
    setUserData({
      ...userData,
      [id]: newValue,
    });
  };
  return (
    <div className="lg:px-10 px-8 pb-10">
    <div className="flex justify-end">
      <Link href={"/"} className="bg-green-700 text-white py-1.5 px-5 text-[12px] rounded-[6px] ">Explore Users</Link>
    </div>
      <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
        Create{" "}
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
          Project
        </span>
      </h1>
      <h5 className="text-sm pt-2">
        Here we can create project inorder to convert ideas into reality , 
      </h5>
      <div className="">
        <form
          action=""
          className="grid grid-cols-1 md:grid-cols-2 max-w-[600px] gap-5 pt-5 text-sm"
        >
          <div className="grid gap-1">
            <label htmlFor="">Project Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              placeholder="Enter your Project Name"
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Support Email</label>
            <input
              type="email"
              id="name"
              name="name"
              value={userData.email}
              placeholder="Enter support Email"
              disabled
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          
          <div className="grid gap-1 md:col-span-2">
            <label htmlFor="">Bio</label>
            <textarea
              name="bio"
              id="bio"
              value={userData.bio}
              onChange={handleInputChange}
              className="bg-inherit w-full min-h-[100px] md:w-full border-green-700 border rounded-md py-1 px-5"
            ></textarea>
          </div>
          <div className="grid gap-1 md:col-span-2">
            <label htmlFor="">Required Skills</label>
            {userData.skills.length > 0 && (
              <div className="py-2 flex flex-wrap gap-4">
                {userData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-0.5 border gap-5 rounded-md border-green-700"
                  >
                    {skill}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setUserData({
                          ...userData,
                          skills: userData.skills.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="skills"
                id="skills"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                placeholder="Search Required skills..."
              />
              <div className="hidden md:flex"></div>
              {query && filteredSuggestions.length > 0 && (
                <div className="max-h-[400px] overflow-y-scroll no-scrollbar border border-green-400 rounded-xl">
                  {filteredSuggestions.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-2 cursor-pointer hover:bg-green-200 hover:dark:bg-green-900 rounded-lg"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                      {userData.skills.includes(item) && (
                        <div className="text-green-500 rounded-full mt-[-2px]">
                          <TiTick />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-1 md:col-span-2">
            <label htmlFor="">Preferred Skills</label>
            {userData.skills.length > 0 && (
              <div className="py-2 flex flex-wrap gap-4">
                {userData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-0.5 border gap-5 rounded-md border-green-700"
                  >
                    {skill}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setUserData({
                          ...userData,
                          skills: userData.skills.filter((_, i) => i !== index),
                        });
                      }}
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="skills"
                id="skills"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                placeholder="Search Preferred skills..."
              />
              <div className="hidden md:flex"></div>
              {query && filteredSuggestions.length > 0 && (
                <div className="max-h-[400px] overflow-y-scroll no-scrollbar border border-green-400 rounded-xl">
                  {filteredSuggestions.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between p-2 cursor-pointer hover:bg-green-200 hover:dark:bg-green-900 rounded-lg"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                      {userData.skills.includes(item) && (
                        <div className="text-green-500 rounded-full mt-[-2px]">
                          <TiTick />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="">
          <div className="grid gap-1">
            <label htmlFor="">Complexity level</label>
            <input
              type="email"
              id="name"
              name="name"
              value={userData.email}
              placeholder="Select Complexity"
              disabled
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Preferred location</label>
            <input
              type="email"
              id="name"
              name="name"
              value={userData.email}
              placeholder="Select location "
              disabled
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="">Requried Experience</label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={userData.experience}
              placeholder="Enter years of experience"
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={userData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1 md:col-span-2">
            <label htmlFor="">Preferred Domains</label>
            {userData.preferred_domains.length > 0 && (
              <div className="py-2 flex flex-wrap gap-4">
                {userData.preferred_domains.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-0.5 border gap-5 rounded-md border-green-700"
                  >
                    {skill}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setUserData({
                          ...userData,
                          preferred_domains: userData.preferred_domains.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="preferred_domains"
                id="preferred_domains"
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                placeholder="Search domains..."
              />
              <div className="hidden md:flex"></div>
              {domainQuery && filteredDomainSuggestions.length > 0 && (
                <div className="max-h-[400px] overflow-y-scroll no-scrollbar border border-green-400 rounded-xl">
                  {filteredDomainSuggestions.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-2 p-2 cursor-pointer hover:bg-green-200 hover:dark:bg-green-900 rounded-lg"
                      onClick={() => handleDomainSelect(item)}
                    >
                      {item}
                      {userData.preferred_domains.includes(item) && (
                        <div className="text-green-500 rounded-full mt-[-2px]">
                          <TiTick />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex md:col-span-2 justify-center pt-5">
            <input
              type="submit"
              value="Save"
              className="hover:bg-green-100 hover:dark:bg-green-900 border duration-300 ease-in-out border-green-600 w-fit rounded-md px-4 cursor-pointer py-1"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
