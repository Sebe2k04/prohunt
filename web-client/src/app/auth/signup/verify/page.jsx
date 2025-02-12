"use client";

import { verifyOtp } from "@/supabase/auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const [otp, setOtp] = useState("");
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  useEffect(() => {
    const emailParam= searchParams.get("email");
    if (emailParam !== null) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await toast.promise(verifyOtp(email, otp), {
        pending: "Pending",
        success: "Created",
        error: "Error",
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-[100vh]">
      <div className="pt-10 flex justify-center">
        <h1 className="lg:text-5xl crimson font-bold text-center md:text-2xl bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
          Verify your
          <br />{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Account
          </span>{" "}
        </h1>
      </div>
      <div className="flex justify-center">
        <h1 className="text-center max-w-[400px] bg-clip-text text-transparent bg-gradient-to-br dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200 font-semibold">
          Let&apos;s go buddy!! , You will got a email from Prohunt
        </h1>
      </div>
      <div className="flex justify-center pt-5 ">
        <form onSubmit={handleSubmit} action="" className="grid gap-5">
          <div className="">
            <input
              type="text"
              name="otp"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="focus:outline-none bg-inherit border rounded-xl dark:border-white border-black px-5 py-2"
              placeholder="Enter 6 Digit OTP"
            />
          </div>
          <div className="">
            <input
              type="submit"
              value={`Verify Account`}
              name=""
              id=""
              className="focus:outline-none w-full text-white bg-inherit border font-bold tracking-wide rounded-xl  border-green-400 hover:tracking-widest hover:from-green-500 hover:to-green-800 duration-200 bg-gradient-to-br from-green-900 via-green-600 to-green-800 px-5 py-2"
            />
          </div>{" "}
          <div className="flex justify-center hover:tracking-wider duration-100 underline-offset-2 hover:underline cursor-pointer">
            Resend OTP
          </div>
        </form>
      </div>
    </div>
  );
}
