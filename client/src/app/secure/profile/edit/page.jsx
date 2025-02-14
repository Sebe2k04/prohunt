"use client";

import { useState } from "react";
import data from "./skills.json";
import domainData from "./domains.json";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";

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
      <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
        Edit{" "}
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
          Profile
        </span>
      </h1>
      <h5 className="text-sm pt-2">
        Here we can update your profile to enhance our profile activity and
        interactions
      </h5>
      <div className="">
        <form
          action=""
          className="grid grid-cols-1 md:grid-cols-2 max-w-[600px] gap-5 pt-5 text-sm"
        >
          <div className="grid gap-1">
            <label htmlFor="">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              placeholder="Enter your Full Name"
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Email</label>
            <input
              type="email"
              id="name"
              name="name"
              value={userData.email}
              placeholder="Enter your Email"
              disabled
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              placeholder="Enter your Phone number"
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={userData.location}
              placeholder="Enter your Location"
              onChange={handleInputChange}
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
            <label htmlFor="">Skills</label>
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
                placeholder="Search skills..."
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
            <label htmlFor="">Certifications</label>
            {userData.certifications.map((certification, index) => {
              return (
                <div
                  key={index}
                  className="grid gap-2 md:grid-cols-2 w-full py-2"
                >
                  <div className="grid gap-1">
                    <label htmlFor="">Certification Name</label>
                    <input
                      type="text"
                      id="certification_name"
                      name="certification_name"
                      value={certification.name}
                      onChange={(e) => {
                        const updatedCertification = [
                          ...userData.certifications,
                        ];
                        updatedCertification[index].name = e.target.value;
                        setUserData({
                          ...userData,
                          certifications: updatedCertification,
                        });
                      }}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="">Certification Url</label>
                    <input
                      type="text"
                      id="certification_url"
                      name="certification_url"
                      value={certification.url}
                      onChange={(e) => {
                        const updatedCertification = [
                          ...userData.certifications,
                        ];
                        updatedCertification[index].url = e.target.value;
                        setUserData({
                          ...userData,
                          certifications: updatedCertification,
                        });
                      }}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>
                  <div
                    onClick={() => {
                      setUserData({
                        ...userData,
                        certifications: userData.certifications.filter(
                          (_, i) => i !== index
                        ),
                      });
                    }}
                    className="hover:bg-green-100 hover:dark:bg-green-900 border border-green-600 w-fit rounded-md px-4 cursor-pointer py-1 flex gap-2 items-center"
                  >
                    <RiDeleteBin5Fill />
                    <h1>Remove</h1>
                  </div>
                </div>
              );
            })}
            <div
              onClick={handleAddCertifications}
              className="hover:bg-green-100 hover:dark:bg-green-900 border duration-300 ease-in-out border-green-600 w-fit rounded-md px-4 cursor-pointer py-1 flex gap-2 items-center"
            >
              <AiFillSafetyCertificate />
              <h1>Add New Certification</h1>
            </div>
            {/* <input
              type="text"
              id="location"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            /> */}
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Experience</label>
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
          <div className="grid gap-1 md:col-span-2">
            <label htmlFor="">Projects</label>
            {userData.projects.map((project, index) => {
              return (
                <div
                  key={index}
                  className="grid gap-2 md:grid-cols-2 w-full py-2"
                >
                  <div className="grid gap-1">
                    <label htmlFor="">Project Name</label>
                    <input
                      type="text"
                      id="project_name"
                      name="project_name"
                      value={project.name}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].name = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="">Live Url - If available</label>
                    <input
                      type="text"
                      id="project_liveUrl"
                      name="project_liveUurl"
                      value={project.liveUrl}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].liveUrl = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="">Github Url - If available</label>
                    <input
                      type="text"
                      id="project_githubUrl"
                      name="project_githubUrl"
                      value={project.githubUrl}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].githubUrl = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    />
                  </div>
                  <div className="grid gap-2 md:col-span-2">
                    <label htmlFor="">Project Domain - Select One</label>
                    <div className="px-3 py-0.5 border gap-5 rounded-md border-green-700 w-fit">
                      Selected Domain :{" "}
                      {project.domain ? project.domain : "none"}
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <input
                        type="text"
                        name="preferred_domains"
                        id="preferred_domains"
                        value={projectDomainQuery}
                        onChange={(e) => setProjectDomainQuery(e.target.value)}
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
                              onClick={(e) => {
                                setDomainQuery("");
                                const updatedProjects = [...userData.projects];
                                updatedProjects[index].domain = item;
                                setUserData({
                                  ...userData,
                                  projects: updatedProjects,
                                });
                              }}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="">Image</label>
                    {/* <input
                      type="text"
                      id="experience"
                      name="experience"
                      value={userData.experience}
                      placeholder="Enter years of experience"
                      onChange={handleInputChange}
                      className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
                    /> */}
                  </div>
                  <div className="grid gap-1 md:col-span-2">
                    <label htmlFor="">Description</label>
                    <textarea
                      name="project_description"
                      id="project_description"
                      value={project.description}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].description = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full min-h-[100px] md:w-full border-green-700 border rounded-md py-1 px-5"
                    ></textarea>
                  </div>

                  <div
                    onClick={() => {
                      setUserData({
                        ...userData,
                        projects: userData.projects.filter(
                          (_, i) => i !== index
                        ),
                      });
                    }}
                    className="hover:bg-green-100 hover:dark:bg-green-900 border border-green-600 w-fit rounded-md px-4 cursor-pointer py-1 flex gap-2 items-center"
                  >
                    <RiDeleteBin5Fill />
                    <h1>Remove</h1>
                  </div>
                </div>
              );
            })}
            <div
              onClick={handleAddProjects}
              className="hover:bg-green-100 hover:dark:bg-green-900 border duration-300 ease-in-out border-green-600 w-fit rounded-md px-4 cursor-pointer py-1 flex gap-2 items-center"
            >
              <AiFillSafetyCertificate />
              <h1>Add New Project</h1>
            </div>
            {/* <input
              type="text"
              id="location"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5 placeholder-gray-400 dark:placeholder-white/20"
            /> */}
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
