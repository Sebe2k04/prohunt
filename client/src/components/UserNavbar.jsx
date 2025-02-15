import Image from "next/image";
import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";

const UserNavbar = () => {
  return (
    <div className="relative">
      <div className="fixed z-[100] w-full border-b dark:bg-[#121212] bg-white dark:border-gray-900 flex items-center justify-between">
        <div className="flex items-center lg:w-[250px] pl-8 border-r dark:border-gray-900 py-1">
          <Image
            src="/logo.png"
            width="500"
            height="500"
            alt="logo"
            className="w-10 h-10 logo dark:logodark"
          />
          <Link href={"/"} className="text-[16px] font-bold pr-2">
            Pro<span className="text-green-600">Hunt</span>
          </Link>
          <h1 className="border-green-600 border px-2 text-xs bg-green-700 dark:bg-green-900 rounded-full text-white">
            Beta
          </h1>
        </div>
        <div className="lg:flex hidden gap-5 items-center text-sm pr-8">
          {/* <div className="flex gap-2 items-center">
            <h1>Theme : </h1>
            <ThemeToggle/>
            </div> */}

          <Link
            href={""}
            className="dark:hover:text-white hover:text-black duration-100"
          >
            Docs
          </Link>
          <Link
            href={""}
            className="dark:hover:text-white hover:text-black duration-100"
          >
            Notifications
          </Link>
          <ThemeToggle />
          {/* <div className="w-7 h-7 rounded-full bg-green-500"></div> */}
        </div>
      </div>
      <div className="lg:w-[250px] pt-[50px] sticky top-0 left-0 h-screen overflow-y-scroll no-scrollbar border-r lg:flex hidden dark:border-gray-900 ">
        <div className="grid gap-5 divide-y dark:divide-gray-900 px-5">
          <div className="pt-3 text-sm grid gap-3">
            <h1 className="dark:text-gray-800 text-gray-500">
              Dashboard
            </h1>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              User Dashboard
            </Link>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
                Project Management
            </Link>
          </div>
          <div className="grid gap-3 text-sm pt-3">
            <h1 className="dark:text-gray-800 text-gray-500">
              Projects
            </h1>

            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              All Projects
            </Link>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Active Projects
            </Link>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Assigned Tasks
            </Link>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Teams
            </Link>
          </div>
          <div className="grid gap-3 text-sm pt-3">
            <h1 className="dark:text-gray-800 text-gray-500">
              Portfolio
            </h1>

            <Link
              href={"/secure/portfolio/templates"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Templates
            </Link>
            <Link
              href={"/secure/portfolio"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              My Portfolio
            </Link>
            <Link
              href={"/secure/integrations"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Integrations
            </Link>
          </div>
          <div className="grid gap-3 text-sm pt-3">
            <h1 className="dark:text-gray-800 text-gray-500">
              Actvity
            </h1>

            <Link
              href={"/secure/interactions"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Recent Interactions
            </Link>
            <Link
              href={"/secure/preferences"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Account Preferences
            </Link>
            <Link
              href={"/secure/activity"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Profile Activity
            </Link>
          </div>
          <div className="grid gap-3 text-sm py-3 pb-5">
            <h1 className="dark:text-gray-800 text-gray-500">
              Account
            </h1>

            <Link
              href={"/secure/settings"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Settings
            </Link>
            <Link
              href={"/secure/profile"}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Profile
            </Link>
            <Link
              href={""}
              className="dark:hover:text-white hover:text-black duration-100"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
