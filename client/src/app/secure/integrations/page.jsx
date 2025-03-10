"use client";
import { useState } from "react";
import axios from "axios";

const platforms = [
  { name: "GitHub" },
  { name: "LeetCode" },
  { name: "HackerRank" },
  { name: "LinkedIn" },
];

export default function Page() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleCardClick = (platform) => {
    setSelectedPlatform(platform);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!username || !selectedPlatform) return;
    setLoading(true);
    try {
      const url = `http://localhost:5000/integrate/${selectedPlatform.name.toLowerCase()}`;
      const response = await axios.post(url, { username, platform: selectedPlatform.name });
      setMessage(`Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setMessage("Failed to integrate. Please try again.");
    } finally {
      setLoading(false);
      setUsername("");
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-8">
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/70 to-gray-500">
        Set Your Preferences
      </h1>
      <p className="text-md text-gray-600 mt-4 max-w-md mx-auto leading-relaxed">
        Customize your preferences to connect with like-minded people.
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            className="p-6 rounded-md bg-gray-900 text-white"
            onClick={() => handleCardClick(platform)}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Enter your {selectedPlatform.name} username:</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800 p-2 border rounded-md mb-4"
              placeholder="Username"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-900 text-white p-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white p-2 rounded-md"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
