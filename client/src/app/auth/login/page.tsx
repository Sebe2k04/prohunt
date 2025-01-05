import Link from "next/link";


export default function Page() {
  return (
    <div className="min-h-[100vh]">
      <div className="pt-10 flex justify-center">
        <h1 className="lg:text-5xl crimson font-bold text-center md:text-2xl bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">
          Login to your <br />{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Prohunt
          </span>{" "}
          Account
        </h1>
      </div>
      <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200 font-semibold">Unwrap your skills and ideas and Showcase who you are ?</h1>
      <div className="flex justify-center pt-5">
        <div className="grid lg:grid-cols-2 divide-dashed divide-x-2 pt-5 place-content-center max-w-[800px] lg:min-w-[600px]">
          <div className="flex justify-center">
            <form action="" className="grid gap-5">
              <div className="">
                <input
                  type="email"
                  name=""
                  id=""
                  className="focus:outline-none bg-inherit border rounded-full dark:border-white border-black px-5 py-2"
                  placeholder="Email Address"
                />
              </div>
              <div className="">
                <input
                  type="Password"
                  name=""
                  id=""
                  className="focus:outline-none bg-inherit border rounded-full dark:border-white border-black px-5 py-2"
                  placeholder="Password"
                />
              </div>{" "}
              <div className="">
                <input
                  type="submit"
                  value={`Login  ` }
                  name=""
                  id=""
                  className="focus:outline-none w-full text-white bg-inherit border font-bold tracking-wide rounded-full  border-green-400 hover:tracking-widest hover:from-green-500 hover:to-green-800 duration-200 bg-gradient-to-br from-green-900 via-green-600 to-green-800 px-5 py-2"
                  placeholder="Password"
                />
              </div>{" "}
            </form>
          </div>
          <div className="text-center flex items-center justify-center">
            <div className="">
              <h1 className="font-semibold text-2xl selection: bg-clip-text text-transparent bg-gradient-to-b dark:to-white from-black  dark:via-white/70 dark:from-black to-zinc-200">New to Prohunt ?</h1>

              <Link href={"/auth/signup"} className="hover:tracking-wider duration-200 hover:underline underline-offset-4">
                Create{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800 font-semibold">
                  New
                </span>{" "}
                Account
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-5 ">
        <Link href={"/auth/forgot-password"} className="font-bold hover:tracking-wider duration-200 bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">Forgot your Password ?</Link>
      </div>
    </div>
  );
}
