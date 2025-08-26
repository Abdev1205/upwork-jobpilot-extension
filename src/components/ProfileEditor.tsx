import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, Save, Palette, Sparkles } from "lucide-react";
import { SearchProfile, PROFILE_COLORS } from "../types";

interface ProfileEditorProps {
  profile: SearchProfile;
  onSave: (profile: SearchProfile) => void;
  onCancel: () => void;
}

const QUICK_TEMPLATES = [
  {
    name: "Frontend",
    keywords:
      "React developer, React.js, Next.js developer, frontend developer, MERN stack, Tailwind CSS, Redux, Typescript, JavaScript, UI developer, Web app development",
  },
  {
    name: "Backend",
    keywords:
      "Node.js developer, Express.js, REST API, GraphQL, backend developer, API integration, Payment gateway, Stripe integration, MongoDB, PostgreSQL, Redis, Docker, NGINX, AWS, Azure, Microservices",
  },
  {
    name: "Full Stack",
    keywords:
      "Full stack developer, MERN stack developer, React.js, Next.js, Node.js, SaaS development, Dashboard development, Marketplace website, Chrome extension developer, Bug fixing, Website optimization",
  },
];

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

  const handleTemplateSelect = (template: (typeof QUICK_TEMPLATES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      keywords: template.keywords,
    }));
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
    <div
      className="w-full min-h-[500px] bg-white flex flex-col"
      style={{ fontFamily: "Roboto, sans-serif" }}
    >
      {/* Sticky Header */}
      <div className="sticky top-0 bg-[#042f1a] border-b border-slate-200 px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          <Button
            onClick={onCancel}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 text-white " />
          </Button>
          <div className="flex-1">
            <h1
              className="text-base font-semibold text-white "
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {profile.name ? "Edit Profile" : "New Profile"}
            </h1>
            <p className="text-xs text-white mt-0.5">
              Configure search preferences
            </p>
          </div>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            size="sm"
            className="h-8 px-3 text-xs bg-[#0fb563] hover:bg-[#0fb563]/90 disabled:bg-slate-300"
          >
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Profile Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Profile Name *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Frontend Heavy"
              className="h-9 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Description
            </label>
            <Input
              type="text"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description..."
              className="h-9 text-sm"
            />
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex items-center gap-3">
              <div
                className="w-6 h-6 rounded-full border-2 border-slate-300 cursor-pointer flex-shrink-0"
                style={{ backgroundColor: formData.color }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <Button
                onClick={() => setShowColorPicker(!showColorPicker)}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
              >
                <Palette className="w-3 h-3 mr-1" />
                Change
              </Button>
            </div>

            {showColorPicker && (
              <div className="mt-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
                <div className="grid grid-cols-5 gap-2">
                  {PROFILE_COLORS.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className="w-6 h-6 rounded-full border-2 border-slate-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Quick Templates
            </label>
            <div className="space-y-1">
              {QUICK_TEMPLATES.map((template, index) => (
                <Button
                  key={index}
                  onClick={() => handleTemplateSelect(template)}
                  variant="outline"
                  size="sm"
                  className="w-full h-8 justify-start text-xs hover:bg-slate-50"
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Search Keywords *
            </label>
            <Textarea
              value={formData.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="Enter comma-separated keywords..."
              rows={4}
              className="resize-none text-xs leading-relaxed"
            />
            <p className="text-xs text-slate-500 mt-1">
              Use specific skills for better job matching
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
