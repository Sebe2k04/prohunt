import Link from "next/link";

export default function Page() {
  return <div className="lg:px-10 px-8">
    <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">Welcome <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">User</span></h1>
    <div className="min-h-[40vh] flex justify-center items-center">
      <Link href={"/recommend"} className="px-4 py-0.5 pb-1 bg-gradient-to-br from-green-500 via-green-700 to-green-800 rounded-lg border-green-400 text-white ">Go to Recommendation</Link>
    </div>
  </div>;
}
