import { NavLink, Outlet } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiSearch,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiClock,
  FiBookOpen,
  FiPlusCircle,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthProvider";
import { useState, useEffect } from "react";
import clsx from "clsx";
import type { User } from "../auth/authTypes";

type IconType = React.ComponentType<{ className?: string }>;

function NavItem({
  to,
  icon: Icon,
  label,
  onClick,
}: {
  to: string;
  icon: IconType;
  label: string;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 min-h-[48px] group",
          isActive
            ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
            : "text-gray-700 hover:bg-gray-100"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={clsx(
              "w-5 h-5",
              isActive
                ? "text-white"
                : "text-gray-500 group-hover:text-brand-500"
            )}
          />
          <span className={clsx("font-medium", isActive && "font-semibold")}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}

function DashboardHeader({
  displayUser,
  user,
  onMenuToggle,
}: {
  displayUser: { first_name: string; last_name: string; email: string };
  user: User | null;
  onMenuToggle?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-4 md:px-8 py-5 shadow-sm">
      <div className="flex items-center justify-between max-w-[2000px] mx-auto">
        {/* Left side - Menu button (mobile) + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back,{" "}
              <span className="font-medium text-gray-700">
                {displayUser?.first_name}
              </span>
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>

          {/* Quick action - desktop only */}
          <NavLink
            to="/dashboard/availability"
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-medium text-sm"
          >
            <FiClock className="w-4 h-4" />
            Manage Schedule
          </NavLink>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-base font-bold shadow-md">
                {displayUser?.first_name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-gray-900">
                  {displayUser?.first_name} {displayUser?.last_name}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {user ? "Student" : "Demo User"}
                </span>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  role="button"
                  tabIndex={0}
                  aria-label="Close user menu"
                  onClick={() => setMenuOpen(false)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Escape" ||
                      e.key === "Enter" ||
                      e.key === " "
                    ) {
                      setMenuOpen(false);
                    }
                  }}
                />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/60 py-2 z-20">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-xl mx-2">
                    <FiUser className="w-4 h-4 text-gray-500" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-xl mx-2">
                    <FiSettings className="w-4 h-4 text-gray-500" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-xl mx-2">
                    <FiHelpCircle className="w-4 h-4 text-gray-500" />
                    Help & Support
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-xl mx-2">
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user } = useAuth();

  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Navigation Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex-1">
        <nav className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Menu
          </p>
          <NavItem
            to="/dashboard"
            icon={FiHome}
            label="Overview"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/bookings"
            icon={FiCalendar}
            label="My Bookings"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/upcoming"
            icon={FiClock}
            label="Upcoming Lessons"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/lessons/new"
            icon={FiBookOpen}
            label="Create Lesson"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/availability"
            icon={FiClock}
            label="Availability"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/find-tutors"
            icon={FiSearch}
            label="Find Tutors"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/settings"
            icon={FiSettings}
            label="Settings"
            onClick={onClose}
          />
        </nav>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <DashboardHeader
        displayUser={displayUser}
        user={user}
        onMenuToggle={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-[300px] bg-gray-50 flex-shrink-0 overflow-y-auto scrollbar-hide">
            <div className="p-6">
              <SidebarContent />
            </div>
          </aside>
        )}

        {/* Mobile Drawer */}
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              role="button"
              tabIndex={0}
              aria-label="Close sidebar menu"
              onClick={() => setSidebarOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                  setSidebarOpen(false);
                }
              }}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-[320px] bg-gray-50 z-50 shadow-2xl animate-slide-up">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                <span className="text-xl font-bold text-gray-900">Menu</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto h-[calc(100vh-81px)]">
                <SidebarContent onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
