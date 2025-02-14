import Link from "next/link";

export default function Page() {
  return (
    <div className="lg:px-10 px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
          My{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
            Profile
          </span>
        </h1>
        <Link href={"/secure/profile/edit"} className="border px-4 py-0.5 border-green-400 hover:bg-green-900 duration-100 rounded-md">Edit</Link>
      </div>{" "}
    </div>
  );
}
