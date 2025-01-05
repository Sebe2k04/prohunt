import Link from "next/link";
import Marquee from "react-fast-marquee";
import { FaArrowRight } from "react-icons/fa";
import { IoLogoVercel } from "react-icons/io5";
import { RiSupabaseFill } from "react-icons/ri";
import { SiRender } from "react-icons/si";
import { FaGithub } from "react-icons/fa";

const pc = [
  {
    name: "Vercel",
    icon: <IoLogoVercel />,
  },
  {
    name: "Supabase",
    icon: <RiSupabaseFill />,
  },
  {
    name: "Render",
    icon: <SiRender />,
  },
  {
    name: "Github",
    icon: <FaGithub />,
  },
];

// const quotes: String[] = [
//   "Innovation",
//   "Collaboration",
//   "Development",
//   "Community",
//   "Technology",
// ];
export default function Home() {
  return (
    <div className="min-h-[100vh] z-10 pt-10 px-8 lg:px-20">
      <div className="flex justify-center text-[12px]">
        <div className=" flex gap-2 dark:shadow-lg border border-green-800  dark:shadow-zinc-800 shadow-green-800 items-center dark:border-t dark:border-zinc-800 p-1.5 pr-3 rounded-full">
          <div className="px-3 py-1 bg-green-900/70 text-white dark:text-inherit border rounded-full border-green-800 ">
            Launch v1.0
          </div>
          <Link href={"/"} className="flex gap-2 items-center hover:opacity-70">
            Learn More
            <FaArrowRight />
          </Link>
        </div>
      </div>
      <div className="flex  justify-center pt-3">
        <h1 className="font-bold max-w-[700px] text-center text-4xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-br dark:from-white from-black  dark:via-white/70 dark:to-black to-zinc-200">
          Innovation comes <br /> with{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-green-800">
            Collaboration
          </span>
        </h1>
      </div>
      <div className="flex justify-center pt-5 text-md">
        <h3 className="max-w-[600px] text-center">
          Project hunt is a open source collaborative platform to build teams
          and it fosters a community driven approach, where contributors can
          improve software or content, offer feedback, and showcase their
          skills.
        </h3>
      </div>
      <div className="md:flex grid text-center justify-center gap-3 pt-5 text-sm">
        <Link
          href={"/"}
          className="px-4 bg-green-900 text-white border-green-600 border rounded-md py-1.5"
        >
          Build Your Team
        </Link>
        <Link
          href={"/"}
          className="px-4 border border-green-800 rounded-md py-1.5"
        >
          Showcase Who You Are?
        </Link>
      </div>
      <h1 className="text-center text-sm pt-5 text-zinc-600">
        Trusted by 10,000+ Developers - Innovators
      </h1>

      {/* <WorldMapDemo /> */}
      {/*  */}
      <h1 className="text-center text-sm pt-20">Powered by</h1>
      {/* <div className="flex justify-center pt-5">
        {pc.map((c, i) => {
          return (
            <div
              key={i}
              className="flex items-center text-xl text-zinc-600 px-5 gap-2"
            >
              <div className="">{c.icon}</div>
              <h1 className="font-semibold">{c.name}</h1>
            </div>
          );
        })}
      </div> */}
      <section className=" overflow-hidden w-full pb-14 pt-5 text-center py-5 lg:px-20">
        <div className="flex ">
          
          <Marquee pauseOnClick>
            {pc.map((c, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center text-xl text-zinc-600 px-5 gap-2"
                >
                  <div className="">{c.icon}</div>
                  <h1 className="font-semibold">{c.name}</h1>
                </div>
              );
            })}
          </Marquee>
          <div className=""></div>
        </div>
      </section>
    </div>
  );
}
