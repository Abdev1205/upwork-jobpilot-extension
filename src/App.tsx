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
      <div className="w-full h-64 flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading...</div>
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
    <div className="w-full min-h-[500px] p-4 bg-background">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Upwork Search Optimizer
          </h1>
          <p className="text-sm text-muted-foreground">
            Quick access to optimized job searches
          </p>
        </div>
        <Button
          onClick={handleCreateProfile}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`relative p-4 rounded-lg border transition-all hover:shadow-md ${
              activeProfile === profile.id
                ? "border-primary bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* Color indicator */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
              style={{ backgroundColor: profile.color }}
            />

            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground truncate">
                    {profile.name}
                  </h3>
                  {activeProfile === profile.id && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
                {profile.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {profile.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 ml-2">
                <Button
                  onClick={() => handleEditProfile(profile)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteProfile(profile.id)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-muted-foreground mb-1">Keywords:</p>
              <p className="text-sm text-foreground line-clamp-2">
                {profile.keywords}
              </p>
            </div>

            <Button
              onClick={() => handleSearch(profile)}
              className="w-full flex items-center gap-2"
              size="sm"
            >
              <Search className="w-4 h-4" />
              Search Jobs
              <ExternalLink className="w-3 h-3 ml-auto" />
            </Button>
          </div>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Search Profiles
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first search profile to get started
          </p>
          <Button onClick={handleCreateProfile}>
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </div>
      )}
    </div>
  );
}
