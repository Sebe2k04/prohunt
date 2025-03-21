"use client";
import IntegrationsHandler from "@/components/IntegrationsHandler";
import ShowIntegrations from "@/components/ShowIntegrations";
import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid"; 

export default function Page() {
  const [showModal, setShowModal] = useState(false);
  const [hasIntegrations, setHasIntegrations] = useState(0); 

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
        className="absolute top-5 right-20 bg-gray-900 text-green-400 p-4 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        onClick={() => setShowModal(true)}
      >
        <PlusIcon className="h-6 w-6" /> 
      </button>

      <ShowIntegrations setHasIntegrations={setHasIntegrations} />

      {hasIntegrations === 0 && (
        <div className="w-full max-w-2xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="p-4 border border-gray-800 rounded-lg bg-gray-900">
                <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <IntegrationsHandler onClose={() => setShowModal(false)} />}
    </div>
  );
}