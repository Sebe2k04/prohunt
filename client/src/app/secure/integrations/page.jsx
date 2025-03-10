"use client";
import { useState } from "react";
import axios from "axios";

const platforms = [
  { name: "GitHub", color: "text-black"},
  { name: "LeetCode", color: "text-black"},
  { name: "HackerRank", color: "text-black"},
  { name: "LinkedIn", color: "text-black"},
];

export default function Page() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!username || !selectedPlatform) return;
    setLoading(true);
    try {
      const url = `http://localhost:5000/integrate/${selectedPlatform.toLowerCase()}`;
      const response = await axios.post(url, { username });
      setMessage(JSON.stringify(response.data, null, 2)); // Displays repo data
    } catch (error) {
      setMessage("Failed to integrate. Please try again.");
    } finally {
      setLoading(false);
      setUsername("");
      setSelectedPlatform(null);
    }
  };  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black/70 to-gray-500">
          Set Your{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-600 to-black/50">
            Preferences
          </span>
        </h1>
        <p className="text-md text-gray-600 mt-4 max-w-md mx-auto leading-relaxed">
          Customize your preferences to draw attention and connect with like-minded people.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {platforms.map((platform) => (
          <button
            key={platform.name}
            className={`p-6 rounded-md ${platform.bg} bg-gray-900`}
            onClick={() => setSelectedPlatform(platform.name)}
          >
            {platform.name}
          </button>
        ))}
      </div>

      {selectedPlatform && (
        <div className="mt-6 w-full max-w-md transition-all">
          <h2 className="text-xl font-semibold">Enter your {selectedPlatform} username:</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded-md mt-2 bg-gray-900"
            placeholder="Username"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-green-600 text-white p-2 rounded-md"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
