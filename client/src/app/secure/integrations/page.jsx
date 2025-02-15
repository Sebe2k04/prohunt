"use client";
import Link from "next/link";

export default function Page() {
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
    </div>
  );
}
