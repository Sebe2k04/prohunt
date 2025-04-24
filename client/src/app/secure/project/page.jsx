"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaChartLine, FaUsers, FaClock, FaCheckCircle,
  FaExclamationCircle, FaPauseCircle, FaSpinner, FaDollarSign,
  FaUserFriends
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function Page() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [analytics, setAnalytics] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0
  });

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setProjects(data || []);
      
      // Calculate analytics
      const stats = {
        total: data.length,
        open: data.filter(p => p.status === 'Open').length,
        inProgress: data.filter(p => p.status === 'In Progress').length,
        completed: data.filter(p => p.status === 'Completed').length,
        onHold: data.filter(p => p.status === 'On Hold').length
      };
      
      setAnalytics(stats);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectToDelete.id);
      
      if (error) throw error;
      
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleRecommend = (project) => {
    // Navigate to recommend page with project data
    window.location.href = `/recommend?projectId=${project.id}`;
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-purple-500';
      case 'On Hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <FaCheckCircle className="text-green-500" />;
      case 'In Progress': return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'Completed': return <FaCheckCircle className="text-purple-500" />;
      case 'On Hold': return <FaPauseCircle className="text-yellow-500" />;
      default: return <FaExclamationCircle className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="lg:px-10 px-8 py-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white dark:from-white dark:to-white/70">
          My{" "}
          <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50 dark:from-green-400 dark:to-white/70">
            Projects
          </span>
        </h1>
        <Link 
          href="/secure/project/create" 
          className="bg-gradient-to-br from-green-500 via-green-600 to-green-800 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
        >
          <FaPlus />
          <span>Create Project</span>
        </Link>
      </motion.div>

      {/* Analytics Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      >
        <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Projects</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.total}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FaChartLine className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open Projects</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.open}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-green-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.inProgress}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <FaSpinner className="text-blue-500 text-xl animate-spin" />
            </div>
          </div>
        </div>

        <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.completed}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <FaCheckCircle className="text-purple-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">On Hold</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{analytics.onHold}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <FaPauseCircle className="text-yellow-500 text-xl" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col md:flex-row gap-4 mb-8"
      >
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-48 bg-inherit border border-gray-200 dark:border-gray-700 rounded-lg py-2 px-4 pl-10 appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </motion.div>

      {/* Projects Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.required_skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.required_skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                      +{project.required_skills.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{project.timeline || 'No timeline'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDollarSign />
                    <span>{project.budget_range || 'No budget'}</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Link
                    href={`/secure/project/edit/${project.id}`}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors duration-200"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(project)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <FaTrash />
                  </button>
                </div>
                <button
                  onClick={() => handleRecommend(project)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors duration-200 text-sm"
                >
                  <FaUserFriends />
                  <span>Recommend</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-inherit border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Delete Project</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}