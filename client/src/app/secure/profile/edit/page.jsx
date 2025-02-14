"use client";

import { useState } from "react";
import Select from "react-select";
import data from "./skills.json";

export default function Page() {
  const skills = data.skills;
  console.log(skills);
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
  });
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
    <div className="lg:px-10 px-8">
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
          className="grid grid-cols-1 md:grid-cols-2 max-w-[600px] gap-5 pt-5"
        >
          <div className="grid gap-1">
            <label htmlFor="">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={userData.name}
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Email</label>
            <input
              type="email"
              id="name"
              name="name"
              value={userData.email}
              disabled
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={userData.location}
              onChange={handleInputChange}
              className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5"
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
            {/* <input type="text" id="location" name="location" value={userData.location} onChange={handleInputChange} className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5" /> */}
          </div>
          <div className="grid gap-1">
            <label htmlFor="">Skills</label>
            {/* <select name="" id="">
                    <option value=""></option>
                </select> */}
            {/* <input type="text" id="location" name="location" value={userData.location} onChange={handleInputChange} className="bg-inherit w-full  border-green-700 border rounded-md py-1 px-5" /> */}
          </div>
        </form>
      </div>
    </div>
  );
}
