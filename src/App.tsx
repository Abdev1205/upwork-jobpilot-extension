import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Settings,
} from "lucide-react";
import {
  SearchProfile,
  StorageData,
  DEFAULT_PROFILES,
  PROFILE_COLORS,
} from "./types";
import { storage, createUpworkSearchUrl, generateId } from "./lib/utils";
import ProfileEditor from "./components/ProfileEditor";
import { Badge } from "./components/ui/badge";

export default function App() {
  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<SearchProfile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = (await storage.get("upworkSearchData")) as StorageData;

      if (data && data.profiles) {
        setProfiles(data.profiles);
        setActiveProfile(data.activeProfile || "");
      } else {
        // First time setup - initialize with default profiles
        setProfiles(DEFAULT_PROFILES);
        setActiveProfile(DEFAULT_PROFILES[0].id);
        await saveData(DEFAULT_PROFILES, DEFAULT_PROFILES[0].id);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setProfiles(DEFAULT_PROFILES);
      setActiveProfile(DEFAULT_PROFILES[0].id);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (
    newProfiles: SearchProfile[],
    newActiveProfile?: string
  ) => {
    const dataToSave: StorageData = {
      profiles: newProfiles,
      activeProfile: newActiveProfile || activeProfile,
    };

    try {
      await storage.set("upworkSearchData", dataToSave);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleSearch = async (profile: SearchProfile) => {
    const url = createUpworkSearchUrl(profile.keywords);

    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab?.id) {
        // If already on Upwork, update the current tab
        if (tab.url?.includes("upwork.com")) {
          await chrome.tabs.update(tab.id, { url });
        } else {
          // Otherwise create a new tab
          await chrome.tabs.create({ url });
        }

        // Set as active profile
        setActiveProfile(profile.id);
        await saveData(profiles, profile.id);

        // Close popup
        window.close();
      }
    } catch (error) {
      console.error("Error opening Upwork search:", error);
    }
  };

  const handleCreateProfile = () => {
    const newProfile: SearchProfile = {
      id: generateId(),
      name: "",
      keywords: "",
      description: "",
      color: PROFILE_COLORS[profiles.length % PROFILE_COLORS.length],
    };
    setEditingProfile(newProfile);
    setIsEditing(true);
  };

  const handleEditProfile = (profile: SearchProfile) => {
    setEditingProfile(profile);
    setIsEditing(true);
  };

  const handleDeleteProfile = async (profileId: string) => {
    const newProfiles = profiles.filter((p) => p.id !== profileId);
    setProfiles(newProfiles);

    // If we deleted the active profile, set a new active one
    let newActiveProfile = activeProfile;
    if (activeProfile === profileId) {
      newActiveProfile = newProfiles[0]?.id || "";
    }
    setActiveProfile(newActiveProfile);

    await saveData(newProfiles, newActiveProfile);
  };

  const handleSaveProfile = async (profile: SearchProfile) => {
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);
    let newProfiles: SearchProfile[];

    if (existingIndex >= 0) {
      // Update existing
      newProfiles = [...profiles];
      newProfiles[existingIndex] = profile;
    } else {
      // Add new
      newProfiles = [...profiles, profile];
    }

    setProfiles(newProfiles);
    await saveData(newProfiles);
    setIsEditing(false);
    setEditingProfile(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProfile(null);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center bg-slate-50">
        <div
          className="text-sm text-slate-600"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (isEditing && editingProfile) {
    return (
      <ProfileEditor
        profile={editingProfile}
        onSave={handleSaveProfile}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div
      className="w-full min-h-[500px] bg-white flex flex-col"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {/* Sticky Header */}
      <div className="sticky w-full top-0 bg-[#042f1a] border-b border-slate-200 px-4 py-3 z-10">
        <div className="flex items-center h-[3rem] justify-between">
          <div className="flex items-center gap-2">
            <img src="./logo.png" alt="" className="w-10 h-10" />
            <div className="flex flex-col justify-center">
              <h1
                className="text-base font-semibold text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Upwork JobPilot
              </h1>
              <p className="text-xs text-white mt-0.5">Quick search profiles</p>
            </div>
          </div>
          <Button
            onClick={handleCreateProfile}
            size="sm"
            className="h-8 px-3 text-xs bg-[#0fb563] hover:bg-[#0fb563]/90"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex w-full overflow-y-auto bg-[#0fb5622f] ">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Settings className="w-8 h-8 text-slate-400 mb-3" />
            <h3
              className="text-sm font-medium text-slate-900 mb-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              No Search Profiles
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create your first profile to get started
            </p>
            <Button
              onClick={handleCreateProfile}
              size="sm"
              className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create Profile
            </Button>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-sm group ${
                  activeProfile === profile.id
                    ? "border-blue-200 bg-blue-50/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {/* Color indicator */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: profile.color }}
                />

                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-sm font-medium text-slate-900 truncate"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {profile.name}
                      </h3>
                      {activeProfile === profile.id && (
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    {profile.description && (
                      <p className="text-xs text-slate-500 leading-tight">
                        {profile.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => handleEditProfile(profile)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-slate-100"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProfile(profile.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="mb-3 overflow-x-auto">
                  <div className={` flex flex-wrap gap-1 `}>
                    {profile.keywords
                      .split(",")
                      .slice(0, 6)
                      .map((keyword, index) => {
                        return (
                          <Badge
                            key={index}
                            className="px-2 text-nowrap py-0.5"
                            variant="outline"
                          >
                            <h3 className=" text-xs font-normal font-sans ">
                              {keyword}
                            </h3>
                          </Badge>
                        );
                      })}
                  </div>
                </div>

                <Button
                  onClick={() => handleSearch(profile)}
                  className="w-full h-8 text-xs  text-white"
                  size="sm"
                  style={{ backgroundColor: profile.color }}
                >
                  <Search className="w-3 h-3 mr-2" />
                  Search Jobs
                  <ExternalLink className="w-2.5 h-2.5 ml-auto" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
