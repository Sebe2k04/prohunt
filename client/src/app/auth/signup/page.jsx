"use client";
import { signup } from "@/supabase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handlePassword = (value) => {
    // const value = e.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    setPassword(value);
    if (passwordRegex.test(value)) {
      setError(false);
      setIsValid(true);
    } else {
      setError(true);
      setIsValid(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await toast.promise(signup(email, password), {
        pending: "Pending",
        success: "Created",
        error: "Error",
      });
      console.log(res);
      router.push(`/auth/signup/verify?email=${email}`);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="min-h-[100vh] lg:px-20 px-8">
      <div className="pt-10 flex justify-center">
        <h1 className="lg:text-5xl text-4xl crimson font-bold text-center md:text-2xl bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
          Create your
          <br />{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Prohunt
          </span>{" "}
          Account
        </h1>
      </div>
      <div className="flex justify-center">
      <h1 className="text-center md:max-w-[500px] max-w-[250px] bg-clip-text text-transparent bg-gradient-to-bl md:bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200 font-semibold">
        Unwrap your skills and ideas and Showcase who you are ?
      </h1>
      </div>
      <div className="flex justify-center pt-5 ">
        <form onSubmit={handleSubmit} action="" className="grid gap-5 ">
          <div className="">
            <input
              type="email"
              name=""
              id=""
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="focus:outline-none bg-inherit border w-full rounded-xl dark:border-white border-black px-5 py-2"
              placeholder="Enter your Email"
            />
          </div>
          <div className="">
            <input
              type="password"
              name=""
              id=""
              value={password}
              required
              onChange={(e) => handlePassword(e.target.value)}
              className="focus:outline-none bg-inherit border w-full rounded-xl dark:border-white border-black px-5 py-2"
              placeholder="Enter your Password"
            />
            <div className="max-w-[250px] pt-2">
            {error === true && (
              <div className="text-red-500 text-sm">
                <h1>Password must include</h1>
                <ul className="list-disc pl-5">
                  <li>Minimum 6 letters</li>
                  <li>includes small letters</li>
                  <li>includes Capital letters</li>
                  <li>includes Numbers</li>
                </ul>
              </div>
            )}
            {isValid && (
              <p className="text-green-500 text-sm">Password is valid!</p>
            )}
          </div>
          </div>
          
          <div className="">
            <input
              type="submit"
              value={`Create Account`}
              name=""
              id=""
              className="focus:outline-none w-full text-white bg-inherit border font-bold tracking-wide rounded-xl  border-green-400 hover:tracking-widest hover:from-green-500 hover:to-green-800 duration-200 bg-gradient-to-br from-green-900 via-green-600 to-green-800 px-5 py-2"
              placeholder="Password"
            />
          </div>{" "}
        </form>
      </div>

      <div className="flex justify-center pt-5 ">
        <Link
          href={"/auth/login"}
          className="font-bold hover:tracking-wider duration-200 bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800"
        >
          Already Have Account ?
        </Link>
      </div>
    </div>
  );
}
