"use client";
import Link from "next/link";
import { useState } from "react";
import domainData from "@/data/domains.json";
import { IoClose } from "react-icons/io5";
import { TiTick } from "react-icons/ti";

export default function Page() {
  const [domainQuery, setDomainQuery] = useState("");
  const AllDomainsuggestions = domainData.domains;
  const filteredDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(domainQuery.toLowerCase())
  ).slice(0, 10);
  const handleDomainSelect = (item) => {
    setDomainQuery("");
    setPreferredDomains([
      ...preferredDomains,
      item,
    ]);
  };

  const [preferredDomains, setPreferredDomains] = useState([]);
  return (
    <div className="lg:px-10 px-8">
      <div className="">
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
          My{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
            Preferences
          </span>
        </h1>
        <h5 className="text-sm pt-2">
          Here we can set our preferences to attract people attention
        </h5>
      </div>{" "}
      <form action="" className="grid pt-5 md:grid-cols-2 text-sm max-w-[600px] gap-5">
        <div className="grid gap-1 md:col-span-2">
          <label htmlFor="">Preferred Domains</label>
          {preferredDomains.length > 0 && (
            <div className="py-2 flex flex-wrap gap-4">
              {preferredDomains.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-3 py-0.5 border gap-5 rounded-md border-green-700"
                >
                  {skill}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      //   setUserData({
                      //     ...userData,
                      //     preferred_domains: userData.preferred_domains.filter(
                      //       (_, i) => i !== index
                      //     ),
                      //   });
                      setPreferredDomains(
                        preferredDomains.filter((_, i) => i !== index)
                      );
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
                    {preferredDomains.includes(item) && (
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
        <div className="flex md:col-span-2">
            <input
              type="submit"
              value="Save"
              className="hover:bg-green-100 hover:dark:bg-green-900 border duration-300 ease-in-out border-green-600 w-fit rounded-md px-4 cursor-pointer py-1"
            />
          </div>
      </form>
    </div>
  );
}
