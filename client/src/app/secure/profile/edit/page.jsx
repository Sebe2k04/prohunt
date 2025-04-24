"use client";

/*
-- SQL Query to update the users table structure based on the profile edit form
-- Run this in your Supabase SQL Editor

-- Add new columns to the existing users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{"twitter":"","facebook":"","instagram":"","linkedin":"","github":""}'::jsonb,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_domains TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS projects JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS experience JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS education JSONB[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS availability BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS users_skills_idx ON users USING GIN (skills);
CREATE INDEX IF NOT EXISTS users_preferred_domains_idx ON users USING GIN (preferred_domains);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create or update policies for secure access
-- Allow public read access to all users
DROP POLICY IF EXISTS "Public users are viewable by everyone" ON users;
CREATE POLICY "Public users are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Allow authenticated users to update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Create a storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
*/

import { useState, useEffect } from "react";
import data from "./skills.json";
import domainData from "./domains.json";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGithub, FaBriefcase, FaGraduationCap, FaCode, FaLayerGroup, FaSearch, FaCamera, FaSave, FaSpinner } from "react-icons/fa";

const AllSkillsuggestions = data.skills;
const AllDomainsuggestions = domainData.domains;

export default function Page() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [domainQuery, setDomainQuery] = useState("");
  const [projectDomainQuery, setProjectDomainQuery] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    avatar_url: "",
    socialMedia: {
      twitter: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      github: ""
    },
    skills: [],
    preferred_domains: [],
    certifications: [],
    projects: [],
    experience: [],
    education: [],
    availability: false
  });
  
  const filteredDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(domainQuery.toLowerCase())
  ).slice(0, 10);
  
  const filteredSuggestions = AllSkillsuggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
  
  const filteredProjectDomainSuggestions = AllDomainsuggestions.filter((item) =>
    item.toLowerCase().includes(projectDomainQuery.toLowerCase())
  ).slice(0, 10);
  
  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Update userData with fetched data
          setUserData({
            ...userData,
            name: data.user_name || "",
            email: data.email || "",
            phone: data.phone || "",
            location: data.location || "",
            website: data.website || "",
            bio: data.bio || "",
            avatar_url: data.avatar_url || "",
            socialMedia: data.social_media || {
              twitter: "",
              facebook: "",
              instagram: "",
              linkedin: "",
              github: ""
            },
            skills: data.skills || [],
            preferred_domains: data.preferred_domains || [],
            certifications: data.certifications || [],
            projects: data.projects || [],
            experience: data.experience || [],
            education: data.education || [],
            availability: data.availability || false
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // Update projectDomainQuery when a project is selected
  useEffect(() => {
    // This effect is no longer needed as we're handling the query directly in the input
    // We'll keep it empty to avoid any side effects
  }, [userData.projects]);

  const handleSelect = (item) => {
    setQuery("");
    setUserData({
      ...userData,
      skills: [...userData.skills, item],
    });
  };
  
  const handleDomainSelect = (item) => {
    setDomainQuery("");
    setUserData({
      ...userData,
      preferred_domains: [...userData.preferred_domains, item],
    });
  };

  const handleProjectDomainSelect = (item, projectIndex) => {
    setProjectDomainQuery("");
    const updatedProjects = [...userData.projects];
    updatedProjects[projectIndex].domain = item;
    setUserData({
      ...userData,
      projects: updatedProjects,
    });
  };

  const handleAddCertifications = () => {
    setUserData({
      ...userData,
      certifications: [...userData.certifications, { name: "", url: "" }],
    });
  };
  
  const handleAddProjects = () => {
    setUserData({
      ...userData,
      projects: [
        ...userData.projects,
        { name: "", liveUrl: "", githubUrl: "", domain: "", description: "" },
      ],
    });
  };

  const handleInputChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    let newValue;
    if (name === "switch") {
      newValue = checked;
    } else if (type === "number") {
      newValue = parseFloat(value);
    } else if (value === "true" || value === "false") {
      newValue = value === "true" ? true : false;
    } else {
      newValue = value;
    }
    setUserData({
      ...userData,
      [id]: newValue,
    });
  };
  
  const handleSocialMediaChange = (platform, value) => {
    setUserData({
      ...userData,
      socialMedia: {
        ...userData.socialMedia,
        [platform]: value,
      },
    });
  };
  
  const handleAvatarUpload = async (e) => {
    if (!user) return;
    
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsSaving(true);
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large. Maximum size is 5MB.");
        return;
      }
      
      // Check file type
      if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
        toast.error("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
        return;
      }
      
      // Create a unique file path with user ID
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload to public bucket with proper path
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));
      
      toast.success('Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Update profile in Supabase
      const { error } = await supabase
        .from('users')
        .update({
          user_name: userData.name,
          bio: userData.bio,
          skills: userData.skills,
          preferred_domains: userData.preferred_domains,
          location: userData.location,
          website: userData.website,
          phone: userData.phone,
          social_media: userData.socialMedia,
          certifications: userData.certifications,
          projects: userData.projects,
          experience: userData.experience,
          education: userData.education,
          availability: userData.availability,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-4xl text-green-600 mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-10 px-8 pb-10">
      <h1 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-black/50 to-white">
        Edit{" "}
        <span className="bg-gradient-to-t bg-clip-text text-transparent from-green-500 to-black/50">
          Profile
        </span>
      </h1>
      <h5 className="text-sm pt-2">
        Update your profile to enhance your visibility and connect with potential collaborators
      </h5>
      
      <div className="mt-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 max-w-[800px] gap-6 pt-5 text-sm">
          {/* Avatar Section */}
          <div className="md:col-span-2 flex flex-col items-center mb-4">
            <div className="relative">
              {userData.avatar_url ? (
                <img 
                  src={userData.avatar_url} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-4 border-green-500">
                  <FaUser className="text-4xl text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <label 
                htmlFor="avatar-upload" 
                className={`absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSaving ? <FaSpinner className="animate-spin" /> : <FaCamera />}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={isSaving}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {isSaving ? "Uploading..." : "Click to upload a new profile picture (max 5MB)"}
            </p>
          </div>
          
          {/* Basic Information */}
          <div className="grid gap-1">
            <label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-300">Name</label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                placeholder="Enter your Full Name"
                onChange={handleInputChange}
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaUser />
              </div>
            </div>
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                placeholder="Enter your Email"
                disabled
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 opacity-70"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaEnvelope />
              </div>
            </div>
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="phone" className="font-medium text-gray-700 dark:text-gray-300">Phone</label>
            <div className="relative">
              <input
                type="text"
                id="phone"
                name="phone"
                value={userData.phone}
                placeholder="Enter your Phone number"
                onChange={handleInputChange}
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaPhone />
              </div>
            </div>
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="location" className="font-medium text-gray-700 dark:text-gray-300">Location</label>
            <div className="relative">
              <input
                type="text"
                id="location"
                name="location"
                value={userData.location}
                placeholder="Enter your Location"
                onChange={handleInputChange}
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaMapMarkerAlt />
              </div>
            </div>
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="website" className="font-medium text-gray-700 dark:text-gray-300">Website</label>
            <div className="relative">
              <input
                type="text"
                id="website"
                name="website"
                value={userData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaGlobe />
              </div>
            </div>
          </div>
          
          <div className="grid gap-1">
            <label htmlFor="bio" className="font-medium text-gray-700 dark:text-gray-300">Bio</label>
            <textarea
              name="bio"
              id="bio"
              value={userData.bio}
              onChange={handleInputChange}
              className="bg-inherit w-full min-h-[120px] border-green-700 border rounded-md py-2 px-5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          
          {/* Social Media Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-1">
                <label htmlFor="twitter" className="font-medium text-gray-700 dark:text-gray-300">Twitter</label>
                <div className="relative">
                  <input
                    type="text"
                    id="twitter"
                    value={userData.socialMedia.twitter}
                    onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                    placeholder="@username"
                    className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                    <FaTwitter />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="facebook" className="font-medium text-gray-700 dark:text-gray-300">Facebook</label>
                <div className="relative">
                  <input
                    type="text"
                    id="facebook"
                    value={userData.socialMedia.facebook}
                    onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                    placeholder="Profile URL"
                    className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                    <FaFacebook />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="instagram" className="font-medium text-gray-700 dark:text-gray-300">Instagram</label>
                <div className="relative">
                  <input
                    type="text"
                    id="instagram"
                    value={userData.socialMedia.instagram}
                    onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                    placeholder="@username"
                    className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                    <FaInstagram />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="linkedin" className="font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
                <div className="relative">
                  <input
                    type="text"
                    id="linkedin"
                    value={userData.socialMedia.linkedin}
                    onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                    placeholder="Profile URL"
                    className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                    <FaLinkedin />
                  </div>
                </div>
              </div>
              
              <div className="grid gap-1">
                <label htmlFor="github" className="font-medium text-gray-700 dark:text-gray-300">GitHub</label>
                <div className="relative">
                  <input
                    type="text"
                    id="github"
                    value={userData.socialMedia.github}
                    onChange={(e) => handleSocialMediaChange('github', e.target.value)}
                    placeholder="Profile URL"
                    className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                    <FaGithub />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Skills</h3>
            {userData.skills.length > 0 && (
              <div className="py-2 flex flex-wrap gap-2 mb-3">
                {userData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-1 border gap-2 rounded-md border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setUserData({
                          ...userData,
                          skills: userData.skills.filter((_, i) => i !== index),
                        });
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Search skills..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaSearch />
              </div>
              {query && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                  {filteredSuggestions.map((item) => (
                    <div
                      key={item}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors duration-200"
                      onClick={() => handleSelect(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Preferred Domains Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Preferred Domains</h3>
            {userData.preferred_domains.length > 0 && (
              <div className="py-2 flex flex-wrap gap-2 mb-3">
                {userData.preferred_domains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-1 border gap-2 rounded-md border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
                  >
                    {domain}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setUserData({
                          ...userData,
                          preferred_domains: userData.preferred_domains.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <IoClose />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Search domains..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                <FaLayerGroup />
              </div>
              {domainQuery && filteredDomainSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                  {filteredDomainSuggestions.map((item) => (
                    <div
                      key={item}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors duration-200"
                      onClick={() => handleDomainSelect(item)}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Certifications Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Certifications</h3>
            {userData.certifications.map((certification, index) => {
              return (
                <div
                  key={index}
                  className="grid gap-2 md:grid-cols-2 w-full py-2 mb-4 border border-green-200 dark:border-green-800 rounded-md p-4"
                >
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Certification Name</label>
                    <input
                      type="text"
                      value={certification.name}
                      onChange={(e) => {
                        const updatedCertification = [
                          ...userData.certifications,
                        ];
                        updatedCertification[index].name = e.target.value;
                        setUserData({
                          ...userData,
                          certifications: updatedCertification,
                        });
                      }}
                      className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Certification URL</label>
                    <input
                      type="text"
                      value={certification.url}
                      onChange={(e) => {
                        const updatedCertification = [
                          ...userData.certifications,
                        ];
                        updatedCertification[index].url = e.target.value;
                        setUserData({
                          ...userData,
                          certifications: updatedCertification,
                        });
                      }}
                      className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setUserData({
                          ...userData,
                          certifications: userData.certifications.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2 transition-colors duration-200"
                    >
                      <RiDeleteBin5Fill />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddCertifications}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              <AiFillSafetyCertificate />
              <span>Add New Certification</span>
            </button>
          </div>
          
          {/* Projects Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Projects</h3>
            {userData.projects.map((project, index) => {
              return (
                <div
                  key={index}
                  className="grid gap-2 md:grid-cols-2 w-full py-2 mb-4 border border-green-200 dark:border-green-800 rounded-md p-4"
                >
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].name = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Live URL</label>
                    <input
                      type="text"
                      value={project.liveUrl}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].liveUrl = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">GitHub URL</label>
                    <input
                      type="text"
                      value={project.githubUrl}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].githubUrl = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Domain</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={project.domain || ""}
                        onChange={(e) => {
                          setProjectDomainQuery(e.target.value);
                        }}
                        onFocus={() => {
                          if (project.domain) {
                            setProjectDomainQuery(project.domain);
                          }
                        }}
                        placeholder="Select domain"
                        className="bg-inherit w-full border-green-700 border rounded-md py-2 px-5 pl-10 placeholder-gray-400 dark:placeholder-white/20 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-600 dark:text-green-400">
                        <FaLayerGroup />
                      </div>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setProjectDomainQuery("");
                            const updatedProjects = [...userData.projects];
                            updatedProjects[index].domain = "";
                            setUserData({
                              ...userData,
                              projects: updatedProjects,
                            });
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <IoClose />
                        </button>
                      </div>
                      {projectDomainQuery && filteredProjectDomainSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 max-h-[200px] overflow-y-auto bg-white dark:bg-gray-800 border border-green-400 rounded-md shadow-lg">
                          {filteredProjectDomainSuggestions.map((item) => (
                            <div
                              key={item}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900 cursor-pointer transition-colors duration-200"
                              onClick={() => handleProjectDomainSelect(item, index)}
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2 grid gap-1">
                    <label htmlFor="" className="font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => {
                        const updatedProjects = [...userData.projects];
                        updatedProjects[index].description = e.target.value;
                        setUserData({
                          ...userData,
                          projects: updatedProjects,
                        });
                      }}
                      className="bg-inherit w-full min-h-[100px] border-green-700 border rounded-md py-2 px-5 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setUserData({
                          ...userData,
                          projects: userData.projects.filter(
                            (_, i) => i !== index
                          ),
                        });
                      }}
                      className="text-red-500 hover:text-red-700 flex items-center gap-2 transition-colors duration-200"
                    >
                      <RiDeleteBin5Fill />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddProjects}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              <FaCode />
              <span>Add New Project</span>
            </button>
          </div>
          
          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center pt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-6 rounded-md hover:shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
