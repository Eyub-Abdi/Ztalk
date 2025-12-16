import { useState } from "react";
import clsx from "clsx";
import { FiSave } from "react-icons/fi";

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
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    timezone: "UTC",
    language: "English",
  });

  // Preferences state
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "account", label: "Account" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "bg-brand-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6 py-6">
          <div className="card p-6">
            <div className="space-y-6">
              {/* Avatar section */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {profile.fullName
                    ? profile.fullName.charAt(0).toUpperCase()
                    : "?"}
                </div>
                <div className="space-y-1">
                  <button className="btn btn-outline text-sm">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF. Max size 5MB
                  </p>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Form fields */}
              <div>
                <label
                  htmlFor="profile-fullname"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
                  className="input w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-bio"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
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
                  className="input w-full resize-y"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {profile.bio.length}/500 characters
                </p>
              </div>

              <button
                onClick={handleSaveProfile}
                className="btn btn-primary flex items-center gap-2"
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
        <div className="space-y-6 py-6">
          <div className="card p-6">
            <div className="space-y-6">
              {/* Regional Settings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Regional Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="profile-timezone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Timezone
                    </label>
                    <select
                      id="profile-timezone"
                      value={profile.timezone}
                      onChange={(e) =>
                        setProfile({ ...profile, timezone: e.target.value })
                      }
                      className="input w-full"
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
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                      Language
                    </label>
                    <select
                      id="profile-language"
                      value={profile.language}
                      onChange={(e) =>
                        setProfile({ ...profile, language: e.target.value })
                      }
                      className="input w-full"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Italian">Italian</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Chinese">Chinese</option>
                    </select>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Security */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Security
                </h3>
                <div className="space-y-3">
                  <button className="btn btn-outline">Change Password</button>
                  <button className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50">
                    Delete Account
                  </button>
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="btn btn-primary flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="space-y-6 py-6">
          <div className="card p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Notification Preferences
                </h3>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        id="notif-email-label"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                    </label>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        id="notif-sms-label"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        SMS Notifications
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                    </label>
                  </div>

                  <hr className="border-gray-200 dark:border-gray-700" />

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        id="notif-marketing-label"
                        className="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Marketing Emails
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
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
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="btn btn-primary flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
