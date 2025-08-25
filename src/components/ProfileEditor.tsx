import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Save, Palette } from "lucide-react";
import { SearchProfile, PROFILE_COLORS } from "../types";

interface ProfileEditorProps {
  profile: SearchProfile;
  onSave: (profile: SearchProfile) => void;
  onCancel: () => void;
}

export default function ProfileEditor({
  profile,
  onSave,
  onCancel,
}: ProfileEditorProps) {
  const [formData, setFormData] = useState<SearchProfile>({
    ...profile,
  });
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleInputChange = (field: keyof SearchProfile, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      color,
    }));
    setShowColorPicker(false);
  };

  const handleSave = () => {
    if (formData.name.trim() && formData.keywords.trim()) {
      onSave({
        ...formData,
        name: formData.name.trim(),
        keywords: formData.keywords.trim(),
        description: formData.description?.trim() || "",
      });
    }
  };

  const isValid =
    formData.name.trim().length > 0 && formData.keywords.trim().length > 0;

  return (
    <div className="w-full min-h-[500px] p-4 bg-background">
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onCancel}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            {profile.name ? "Edit Profile" : "New Profile"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your search keywords and preferences
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profile Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Frontend Heavy, Backend Focus..."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description (Optional)
          </label>
          <Input
            type="text"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Brief description of this search profile..."
          />
        </div>

        {/* Color Selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Profile Color
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 border-border cursor-pointer"
              style={{ backgroundColor: formData.color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <Button
              onClick={() => setShowColorPicker(!showColorPicker)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Change Color
            </Button>
          </div>

          {showColorPicker && (
            <div className="mt-3 p-3 border border-border rounded-md bg-card">
              <div className="grid grid-cols-5 gap-2">
                {PROFILE_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(color)}
                    className="w-8 h-8 rounded-full border-2 border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Keywords *
          </label>
          <Textarea
            value={formData.keywords}
            onChange={(e) => handleInputChange("keywords", e.target.value)}
            placeholder="Enter comma-separated keywords that will be used for Upwork job search..."
            rows={6}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Tip: Use specific skills and technologies for better job matching
          </p>
        </div>

        {/* Quick Templates */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quick Templates
          </label>
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() =>
                handleInputChange(
                  "keywords",
                  "React developer, React.js, Next.js developer, frontend developer, MERN stack, Tailwind CSS, Redux, Typescript, JavaScript, UI developer, Web app development"
                )
              }
              variant="outline"
              size="sm"
              className="justify-start text-left"
            >
              Frontend Heavy Template
            </Button>
            <Button
              onClick={() =>
                handleInputChange(
                  "keywords",
                  "Node.js developer, Express.js, REST API, GraphQL, backend developer, API integration, Payment gateway, Stripe integration, MongoDB, PostgreSQL, Redis, Docker, NGINX, AWS, Azure, Microservices"
                )
              }
              variant="outline"
              size="sm"
              className="justify-start text-left"
            >
              Backend Heavy Template
            </Button>
            <Button
              onClick={() =>
                handleInputChange(
                  "keywords",
                  "Full stack developer, MERN stack developer, React.js, Next.js, Node.js, SaaS development, Dashboard development, Marketplace website, Chrome extension developer, Bug fixing, Website optimization"
                )
              }
              variant="outline"
              size="sm"
              className="justify-start text-left"
            >
              Full Stack Template
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-border">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Profile
        </Button>
      </div>
    </div>
  );
}
