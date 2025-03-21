"use client";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthProvider";

export default function IntegrationsHandler({ onClose }) {
  const { userId } = useAuth(); // Get userId from context
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const platforms = ["LeetCode", "GitHub", "CodeForces", "HackerRank"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !selectedPlatform) return;
    setLoading(true);

    try {
      console.log(userId)
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const platform = selectedPlatform.toLowerCase();
      const url = `http://localhost:5000/integrate/${platform}`;

      const payload = { username, user_id: userId };

      const response = await axios.post(url, payload, { withCredentials: true });

      if (response.data) {
        toast.success("Integration Successful!");
      } else {
        toast.error("Integration Failed!");
      }

      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Integration Failed!");
    } finally {
      setLoading(false);
      setUsername("");
      setSelectedPlatform(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-50 fixed inset-0">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-3xl font-bold text-white">Integrate Platform</h2>
        <p className="text-sm text-gray-400">Connect your profile to Prohunt</p>
        <div className="grid grid-cols-2 gap-4 my-4">
          {platforms.map((platform) => (
            <button
              key={platform}
              className={`p-2 rounded-lg font-semibold text-white transition duration-200 border border-green-500 ${
                selectedPlatform === platform
                  ? "bg-green-700"
                  : "hover:bg-green-900"
              }`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full bg-gray-100 p-2 border font-semibold rounded-full text-center text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-2 rounded-full transition"
            disabled={loading}
          >
            {loading ? "Integrating..." : "Submit"}
          </button>
        </form>
        <button
          className="mt-4 text-red-500 hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
