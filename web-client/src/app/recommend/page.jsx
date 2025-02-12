"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const project = {
    project_id: 101,
    project_name: "AI Chatbot Development",
    required_skills: ["Python"],
    preferred_skills: ["React", "JavaScript"],
    complexity: "High",
    location: "New York",
    shift: "Day",
    compensation_type: "Price",
    domain: "AI",
  };
  const [users, setUsers] = useState([]);
  console.dir(users);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.post("http://localhost:5000/recommend", project);
      setUsers(res.data);
      console.log(res);
    };

    fetchUsers();
  }, []);
  
  return (
    <div className="lg:px-20 px-8 min-h-[100vh]">
      <h1 className="pt-5 text-3xl font-semibold ">Recommended Users</h1>
      <div className="grid grid-cols-3 gap-5">
        <div className=" relative p-2">
          <div className="p-5 sticky top-12">
            <h1>Based on our project data , the user results are shown</h1>
            <div className="pt-5">
              <h1 className="font-semibold text-xl">Project Data</h1>
              <div className="pt-3">
                <h1>Project Name: {project.project_name}</h1>
                <h1>Required Skills: {project.required_skills.join(", ")}</h1>
                <h1>Preferred Skills: {project.preferred_skills.join(", ")}</h1>
                <h1>Complexity: {project.complexity}</h1>
                {/* <h1>Location: {project.location}</h1> */}
                {/* <h1>Shift: {project.shift}</h1> */}
                <h1>Compensation Type: {project.compensation_type}</h1>
                <h1>Domain: {project.domain}</h1>
                <div className="py-5">
                  <div className="px-4 py-0.5 pb-1 w-fit text-sm bg-gradient-to-br from-green-500 via-green-700 to-green-800 font-semibold rounded-lg border-green-400 text-white">
                    See More
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="grid gap-2 py-4">
            {users &&
              users.map((user, i) => {
                return (
                  <div
                    key={i}
                    className=" py-2 px-5 border flex justify-between border-green-500 border-l-8 gap-3 rounded-xl"
                  >
                    <div className="">
                      <h1 className="text-xl font-semibold">{user.name}</h1>
                      <div className="pt-2 flex list-disc gap-1">
                        {user.skills.map((skill, i) => {
                          return (
                            <div key={i} className="">
                              {user.skills.length - 1 == i ? (
                                <h1 key={i} className="text-gray-600">
                                  {skill}
                                </h1>
                              ) : (
                                <h1 key={i} className="text-gray-600">
                                  {skill} ,
                                </h1>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="px-4 py-0.5 pb-1 bg-gradient-to-br from-green-500 via-green-700 to-green-800 font-semibold rounded-lg border-green-400 text-white">
                        View
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
