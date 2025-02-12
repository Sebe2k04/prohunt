import Link from "next/link";
import React from "react";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
const Navbar = () => {
  return (
    <div className="">
      <div className="fixed w-full z-50 text-sm backdrop-blur-md">
      <div className="py-2 lg:px-20 md:px-10 px-5 flex justify-between dark:border-gray-900 border-b-[0.5px]">
        <div className="flex  items-center">
          <Image
            src="/logo.png"
            width="500"
            height="500"
            alt="logo"
            className="w-10 h-10 logo dark:logodark"
          />
          <Link href={"/"} className="text-[16px] font-bold pr-2">Pro<span className="text-green-600">Hunt</span></Link>
          <h1 className="border-green-600 border px-2 text-xs bg-green-700 dark:bg-green-900 rounded-full text-white">Beta</h1>
        </div>
        <div className="lg:flex hidden items-center gap-7  text-sm font-semibold">
          <Link href={"/"} className="dark:hover:text-white hover:text-black duration-100">About</Link>
          <Link href={"/"} className="dark:hover:text-white hover:text-black duration-100">Products</Link>
          <Link href={"/"} className="dark:hover:text-white hover:text-black duration-100">Developers</Link>
          <Link href={"/"} className="dark:hover:text-white hover:text-black duration-100">Support</Link>
        </div>
        <div className="lg:flex hidden items-center gap-5">
          <ThemeToggle />
          <Link
            href={"/secure/dashboard"}
            className="px-4 pt-1 py-0.5 pb-1 bg-gradient-to-br from-green-500 via-green-700 to-green-800 font-semibold rounded-md border-green-400 text-white"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
    <div className="pt-20"></div>
    </div>
  );
};

export default Navbar;
