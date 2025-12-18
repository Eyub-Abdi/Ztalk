import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  FiSave,
  FiCheckCircle,
  FiCircle,
  FiLock,
  FiAlertTriangle,
  FiX,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiGlobe,
  FiMapPin,
  FiBook,
  FiAward,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";

interface ChecklistItem {
  id: string;
  label: string;
  helper?: string;
  completed: boolean;
  action?: {
    label: string;
    to?: string;
    scrollTo?: string;
  };
}

// Simple toast replacement
function useToast() {
  return {
    show: (options: {
      title: string;
      description?: string;
      status?: string;
    }) => {
      console.log(
        `[${options.status}] ${options.title}: ${options.description || ""}`
      );
    },
  };
}

type TabKey = "profile" | "account" | "notifications";

export default function Settings() {
  const toast = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // Profile state - initialize with user data
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    timezone: "UTC",
    language: "English",
  });

  // Sync profile with user data on mount
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName:
          `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
          prev.fullName,
        email: user.email || prev.email,
        phone: user.phone_number || prev.phone,
      }));
    }
  }, [user]);

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  // Password change modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Delete account modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Teaching profile state
  const [teachingProfile, setTeachingProfile] = useState({
    tagline: "Experienced Swahili teacher from Zanzibar",
    countryCode: "tz",
    countryName: "United Republic of Tanzania",
    city: "Zanzibar",
    tutorType: "Community Tutor" as "Community Tutor" | "Professional Teacher",
    teaches: [
      { language: "Swahili", level: "Native" as const },
      { language: "English", level: "C2" as const },
    ],
    speaks: [
      { language: "Arabic", level: "B2" as const },
      { language: "Spanish", level: "B2" as const },
      { language: "Portuguese", level: "B1" as const },
      { language: "German", level: "A2" as const },
      { language: "Norwegian", level: "A1" as const },
      { language: "Russian", level: "A1" as const },
      { language: "Korean", level: "A1" as const },
    ],
    interests: ["Films & TV Series", "Science", "Tech", "Travel", "Music", "Cooking"],
    education: [
      { degree: "Bachelor of Arts in Linguistics", institution: "University of Dar es Salaam", year: "2019" },
    ],
    certifications: [
      { name: "TEFL Certificate", issuer: "International TEFL Academy", year: "2020" },
      { name: "Swahili Language Teaching", issuer: "Zanzibar Language Institute", year: "2018" },
    ],
  });

  // Available languages for dropdowns
  const availableLanguages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", 
    "Russian", "Japanese", "Chinese", "Korean", "Arabic", "Swahili",
    "Hindi", "Turkish", "Dutch", "Polish", "Norwegian", "Swedish"
  ];
  
  const proficiencyLevels = ["Native", "C2", "C1", "B2", "B1", "A2", "A1"] as const;
  type ProficiencyLevel = typeof proficiencyLevels[number];

  // Proficiency bars component
  const levelToBars: Record<string, number> = {
    Native: 6, C2: 6, C1: 5, B2: 4, B1: 3, A2: 2, A1: 1,
  };

  const ProficiencyBars = ({ level }: { level: string }) => {
    const filled = levelToBars[level] || 1;
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={clsx(
              "w-1 h-3 rounded-sm",
              i <= filled ? "bg-gray-700" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  // Profile completion checklist logic
  const computeChecklist = useCallback((): ChecklistItem[] => {
    let hasPhoto = false;
    let hasDescription = false;
    let hasAvailability = false;

    if (typeof window !== "undefined") {
      const profileRaw = localStorage.getItem("tutorProfile");
      if (profileRaw) {
        try {
          const savedProfile = JSON.parse(profileRaw);
          hasPhoto = Boolean(savedProfile.photoUrl);
          hasDescription = Boolean(savedProfile.description?.trim());
        } catch {
          // ignore
        }
      }
      // Also check current bio state
      if (profile.bio?.trim()) {
        hasDescription = true;
      }
      const availRaw = localStorage.getItem("tutor_availability_v1");
      if (availRaw) {
        try {
          const avail = JSON.parse(availRaw);
          hasAvailability = Object.values(avail).some(
            (slots) => Array.isArray(slots) && slots.length > 0
          );
        } catch {
          // ignore
        }
      }
    }

    return [
      {
        id: "photo",
        label: "Upload a profile photo",
        helper: "Profiles with photos get 4× more bookings.",
        completed: hasPhoto,
        action: {
          label: hasPhoto ? "Change" : "Upload",
          scrollTo: "avatar-section",
        },
      },
      {
        id: "description",
        label: "Write a tutor description",
        helper: "Tell students about your teaching style.",
        completed: hasDescription,
        action: {
          label: hasDescription ? "Edit" : "Write now",
          scrollTo: "bio-section",
        },
      },
      {
        id: "availability",
        label: "Publish weekly availability",
        helper: "Open slots so students can book you right away.",
        completed: hasAvailability,
        action: {
          label: hasAvailability ? "Adjust" : "Set availability",
          to: "/dashboard/availability",
        },
      },
    ];
  }, [profile.bio]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() =>
    computeChecklist()
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => setChecklist(computeChecklist());
    sync();
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
    };
  }, [computeChecklist]);

  const completionMetrics = useMemo(() => {
    const total = checklist.length;
    const completed = checklist.filter((item) => item.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [checklist]);

  const handleChecklistAction = (item: ChecklistItem) => {
    if (item.action?.scrollTo) {
      const element = document.getElementById(item.action.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("ring-2", "ring-brand-500", "ring-offset-2");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-brand-500", "ring-offset-2");
        }, 2000);
      }
    }
  };

  const handleSaveProfile = () => {
    toast.show({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
      status: "success",
    });
  };

  const handleSavePreferences = () => {
    toast.show({
      title: "Preferences updated",
      description: "Your preferences have been saved successfully.",
      status: "success",
    });
  };

  const handleChangePassword = () => {
    setPasswordError("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // TODO: API call to change password
    toast.show({
      title: "Password changed",
      description: "Your password has been updated successfully.",
      status: "success",
    });

    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    setDeleteError("");

    if (deleteConfirmEmail !== profile.email) {
      setDeleteError("Email does not match your account email");
      return;
    }

    // TODO: API call to delete account
    toast.show({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
      status: "success",
    });

    setShowDeleteModal(false);
    setDeleteConfirmEmail("");
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "account", label: "Account" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-6 py-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-2 bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl w-fit border border-gray-200/60 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-6 py-3 rounded-xl text-sm font-semibold transition-all",
              activeTab === tab.key
                ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/50"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Profile Completion Card */}
          {completionMetrics.percent < 100 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-900/30 shadow-lg shadow-blue-900/5">
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Complete Your Profile
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Finish these steps to appear higher in tutor search
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {completionMetrics.percent}%
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {completionMetrics.completed} of {completionMetrics.total}{" "}
                      done
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-700 shadow-lg shadow-blue-500/50 relative overflow-hidden"
                    style={{ width: `${completionMetrics.percent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>

                {/* Checklist items */}
                <div className="space-y-2">
                  {checklist.map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/80 dark:hover:bg-gray-800/50 transition-all duration-200"
                    >
                      {item.completed ? (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                          <FiCheckCircle className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <FiCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={clsx(
                            "text-sm font-medium",
                            item.completed
                              ? "text-gray-500 line-through"
                              : "text-gray-900 dark:text-gray-100"
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                      {!item.completed &&
                        item.action &&
                        (item.action.to ? (
                          <Link
                            to={item.action.to}
                            className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:text-white bg-brand-50 hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 rounded-lg transition-all duration-200"
                          >
                            {item.action.label}
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleChecklistAction(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-brand-600 hover:text-white bg-brand-50 hover:bg-gradient-to-r hover:from-brand-500 hover:to-brand-600 rounded-lg transition-all duration-200"
                          >
                            {item.action.label}
                          </button>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Profile Form Card */}
          <div className="bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200/60 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
            <div className="space-y-8">
              {/* Avatar section */}
              <div
                id="avatar-section"
                className="flex items-center gap-5 pb-8 border-b border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 rounded-xl"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-2xl font-bold text-white">
                  {profile.fullName
                    ? profile.fullName.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="space-y-2">
                  <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 hover:-translate-y-0.5 transition-all">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max size 5MB
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <div>
                <label
                  htmlFor="profile-fullname"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                >
                  Full Name
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                >
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                >
                  Phone Number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                />
              </div>

              <div
                id="bio-section"
                className="transition-all duration-300 rounded-xl"
              >
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                >
                  Bio
                </label>
                <textarea
                  id="profile-bio"
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell students about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-y font-medium"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all font-semibold"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200/60 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
          <div className="space-y-8">
            {/* Regional Settings */}
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-5">
                Regional Settings
              </h3>
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="profile-timezone"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                  >
                    Timezone
                  </label>
                  <select
                    id="profile-timezone"
                    value={profile.timezone}
                    onChange={(e) =>
                      setProfile({ ...profile, timezone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                  >
                    <option value="UTC">UTC (GMT+0)</option>
                    <option value="America/New_York">
                      Eastern Time (GMT-5)
                    </option>
                    <option value="America/Chicago">
                      Central Time (GMT-6)
                    </option>
                    <option value="America/Denver">
                      Mountain Time (GMT-7)
                    </option>
                    <option value="America/Los_Angeles">
                      Pacific Time (GMT-8)
                    </option>
                    <option value="Europe/London">London (GMT+0)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="profile-language"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2.5"
                  >
                    Language
                  </label>
                  <div className="relative">
                    <select
                      id="profile-language"
                      value={profile.language}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                    <FiLock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Language cannot be changed after initial setup. Contact
                    support if you need to update it.
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

            {/* Security */}
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-5">
                Security
              </h3>
              <div className="p-5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Password
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <FiLock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all font-semibold"
            >
              <FiSave className="w-4 h-4" />
              Save Changes
            </button>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t-2 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-2 mb-4">
                <FiAlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                  Danger Zone
                </h3>
              </div>
              <div className="p-5 bg-red-50/50 dark:bg-red-900/10 rounded-xl border-2 border-red-200 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Delete Account
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-gradient-to-br from-white via-gray-50/30 to-brand-50/10 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200/60 dark:border-gray-700/50 shadow-lg shadow-gray-900/5">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                Notification Preferences
              </h3>

              <div className="space-y-5">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/50 hover:shadow-md transition-all">
                  <div>
                    <p
                      id="notif-email-label"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Email Notifications
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Receive booking confirmations and updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          emailNotifications: e.target.checked,
                        })
                      }
                      aria-labelledby="notif-email-label"
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/30 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-brand-600"></div>
                  </label>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/50 hover:shadow-md transition-all">
                  <div>
                    <p
                      id="notif-sms-label"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      SMS Notifications
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Receive booking reminders via text message
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.smsNotifications}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          smsNotifications: e.target.checked,
                        })
                      }
                      aria-labelledby="notif-sms-label"
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/30 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-brand-600"></div>
                  </label>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between p-5 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-gray-200/60 dark:border-gray-700/50 hover:shadow-md transition-all">
                  <div>
                    <p
                      id="notif-marketing-label"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Marketing Emails
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Receive tips, offers, and product updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketingEmails}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          marketingEmails: e.target.checked,
                        })
                      }
                      aria-labelledby="notif-marketing-label"
                      className="sr-only peer"
                    />
                    <div className="w-12 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-500/30 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow-md dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-brand-500 peer-checked:to-brand-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="flex items-center gap-2.5 px-7 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all font-semibold"
            >
              <FiSave className="w-4 h-4" />
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPasswordModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <FiLock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your current and new password
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {passwordError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiAlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Warning:</strong> Deleting your account will permanently
                remove all your data, including:
              </p>
              <ul className="mt-2 text-sm text-red-600 dark:text-red-400 list-disc list-inside space-y-1">
                <li>Your profile and settings</li>
                <li>All lesson history and bookings</li>
                <li>Student connections and messages</li>
                <li>Earnings history and payout information</li>
              </ul>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                {deleteError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type your email to confirm:{" "}
                <span className="text-red-500">
                  {profile.email || "your@email.com"}
                </span>
              </label>
              <input
                type="email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
                placeholder="Enter your email address"
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmEmail("");
                  setDeleteError("");
                }}
                className="flex-1 px-5 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmEmail !== profile.email}
                className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
