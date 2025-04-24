"use client";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  FaUser, 
  FaProjectDiagram,
  FaArrowRight, 
  FaCode,
  FaCheckCircle,
  FaClock,
  FaTools,
  FaSpinner,
  FaPauseCircle
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects');
  const [userProfile, setUserProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState({
    total: 0,
    completed: 0,
    active: 0,
    skillsUsed: new Set()
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      try {
        console.log("Fetching data for user:", user.id);

        // Fetch user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error("User fetch error:", userError);
          throw userError;
        }

        console.log("User data:", userData);

        // Fetch user's projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('created_by', user.id);

        if (projectsError) {
          console.error("Projects fetch error:", projectsError);
          throw projectsError;
        }

        console.log("Raw projects data:", projectsData);

        // Ensure projectsData is an array
        const validProjects = Array.isArray(projectsData) ? projectsData : [];

        // Calculate analytics with exact status matches
        const stats = {
          total: validProjects.length,
          completed: validProjects.filter(p => p.status === 'Completed').length,
          active: validProjects.filter(p => ['In Progress', 'Open'].includes(p.status)).length,
          skillsUsed: new Set(validProjects.flatMap(p => p.required_skills || []))
        };

        console.log("Calculated stats:", stats);

        // Update state with validated data
        setUserProfile({
          ...userData,
          completedProjects: stats.completed,
          activeProjects: stats.active,
          skills: userData?.skills || []
        });

        setProjects(validProjects);
        setAnalytics(stats);

        console.log("States updated with:", {
          projectsCount: validProjects.length,
          stats,
          userData
        });

        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetchData:", error);
        toast.error("Failed to load dashboard data: " + (error.message || "Unknown error"));
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'In Progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'Completed': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'On Hold': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400';
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <FaCheckCircle className="text-green-600 dark:text-green-400" />;
      case 'In Progress': return <FaSpinner className="text-blue-600 dark:text-blue-400 animate-spin" />;
      case 'Completed': return <FaCheckCircle className="text-purple-600 dark:text-purple-400" />;
      case 'On Hold': return <FaPauseCircle className="text-yellow-600 dark:text-yellow-400" />;
      default: return <FaCheckCircle className="text-gray-600 dark:text-gray-400" />;
    }
  };

  if (!user) {
    console.log("No user found");
    return null;
  }

  if (isLoading) {
    console.log("Dashboard is loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  console.log("Rendering dashboard with:", {
    projectsCount: projects.length,
    userProfile: userProfile,
    analytics: analytics
  });

  return (
    <div className="min-h-screen bg-inherit">
      <div className="lg:px-10 px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white dark:from-white dark:to-white/70">
            Welcome back, <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50 dark:from-green-400 dark:to-white/70">
              {userProfile?.name || "User"}
            </span>
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
            Manage your projects and profile all in one place.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`pb-4 px-1 flex items-center space-x-2 ${
                activeTab === 'projects' 
                  ? 'border-b-2 border-green-500 text-green-500 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaProjectDiagram />
              <span>Projects</span>
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-1 flex items-center space-x-2 ${
                activeTab === 'profile' 
                  ? 'border-b-2 border-green-500 text-green-500 font-medium' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <FaUser />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <FaCheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.completed}</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400">Completed Projects</h3>
              </div>
              <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <FaClock className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.active}</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400">Active Projects</h3>
              </div>
              <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <FaTools className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.skillsUsed.size}</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400">Skills Used</h3>
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Projects</h2>
                <Link 
                  href="/secure/project/create" 
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <span>New Project</span>
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Link 
                    key={project.id} 
                    href={`/secure/project/${project.id}`}
                    className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-green-400 dark:hover:border-green-500 transition-colors duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-2 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span>{project.status}</span>
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {project.required_skills?.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Overview */}
            <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <FaUser className="text-green-600 dark:text-green-400" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {userProfile?.name || "User"}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">{userProfile?.email}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile?.skills?.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.completed}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Completed</div>
                </div>
                <div className="text-center p-4 bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.active}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                </div>
                <div className="text-center p-4 bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userProfile?.skills?.length || 0}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Skills</div>
                </div>
                <div className="text-center p-4 bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {analytics.total}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Projects</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                href="/secure/profile/edit" 
                className="group bg-inherit border border-green-400 dark:border-green-500 rounded-lg p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaUser className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Edit Profile</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Update your information</p>
                    </div>
                  </div>
                  <FaArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
              <Link 
                href="/secure/profile/skills" 
                className="group bg-inherit border border-green-400 dark:border-green-500 rounded-lg p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300">
                      <FaCode className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Manage Skills</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Update your skill set</p>
                    </div>
                  </div>
                  <FaArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
