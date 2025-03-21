"use client";
import IntegrationsHandler from "@/components/IntegrationsHandler";
import { useState } from "react";

export default function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-8 relative">
      <div className="absolute top-5 left-5">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/70 to-gray-500"> 
          Set Your Preferences
        </h1>
        <p className="text-md text-gray-600 mt-4 max-w-md leading-relaxed">
          Customize your preferences to connect with like-minded people.
        </p>
      </div>

      <button
        className="bg-gray-900 text-green-900 p-4 rounded-full flex items-center justify-center"
        onClick={() => setShowModal(true)}
      >
        add
      </button>
      <p className="text-md text-gray-600 mt-2">Click the add button to interlink with multiple platforms.</p>

      {showModal && <IntegrationsHandler onClose={() => setShowModal(false)} />}
    </div>
  );
}
