import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@/context/AuthProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const ShowIntegrations = ({ setHasIntegrations }) => {
  const [integrations, setIntegrations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchIntegrations = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("integrations")
          .eq("id", userId)
          .single();

        if (error) throw error;

        const formattedIntegrations = data?.integrations || {};
        setIntegrations(formattedIntegrations);

        setHasIntegrations(Object.keys(formattedIntegrations).length);
      } catch (error) {
        console.error("Error fetching integrations:", error);
        setError("Failed to fetch integrations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, [userId, setHasIntegrations]);

  // Helper function to render nested objects
  const renderNestedObject = (obj) => {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className="ml-4">
            <p className="font-semibold text-green-400">{key}:</p>
            {renderNestedObject(value)}
          </div>
        );
      }
      return (
        <p key={key} className="text-gray-100">
          <span className="font-semibold text-green-400">{key}:</span> {value}
        </p>
      );
    });
  };

  // Calculate the number of skeleton cards needed
  const skeletonCardsCount = Math.max(0, 4 - (integrations ? Object.keys(integrations).length : 0));

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Render integration cards */}
        {integrations &&
          Object.entries(integrations).map(([platform, details]) => (
            <div
              key={platform}
              className="bg-gradient-to-r from-black/50 to-green-900 rounded-lg p-4 border border-gray-800"
            >
              <h3 className="text-lg font-semibold mb-2 text-green-300">
                {platform.toUpperCase()}
              </h3>
              <div className="bg-transparent p-3 rounded-md text-sm">
                {renderNestedObject(details)}
              </div>
            </div>
          ))}

        {[...Array(skeletonCardsCount)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="p-4 border border-gray-800 rounded-lg bg-gray-900 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowIntegrations;