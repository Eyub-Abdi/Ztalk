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
          <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-brand-500")} />
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
    <header className="sticky top-0 z-[1000] bg-white border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button (mobile) + title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-0.5">
              Welcome back, {displayUser?.first_name}
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
            </button>
            <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
              3
            </span>
          </div>

          {/* Quick action - desktop only */}
          <NavLink
            to="/dashboard/availability"
            className="hidden lg:flex btn btn-sm btn-primary"
          >
            <FiClock className="w-4 h-4 mr-1" />
            Availability
          </NavLink>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                {displayUser?.first_name.charAt(0)}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {displayUser?.first_name} {displayUser?.last_name}
                </span>
                <span className="text-xs text-gray-500">
                  {user ? "Student" : "Demo User"}
                </span>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-500" />
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <FiUser className="w-4 h-4" />
                    My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <FiSettings className="w-4 h-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <FiHelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                  <hr className="my-1" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
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
      {/* User Profile Card */}
      <div className="bg-brand-500 border border-brand-600 rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-500 font-semibold">
            {displayUser.first_name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white truncate max-w-[128px]">
              {displayUser.first_name} {displayUser.last_name}
            </p>
            <p className="text-xs text-brand-100">
              {user ? "Student" : "Demo User"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-brand-500 border border-brand-600 rounded-xl p-4 shadow-md flex-1">
        <nav className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-brand-100 uppercase mb-2">
            Navigation
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

      {/* Quick Actions Card */}
      <div className="bg-brand-500 border border-brand-600 rounded-xl p-4 shadow-md">
        <p className="text-xs font-semibold text-brand-100 uppercase mb-3">
          Quick Actions
        </p>
        <div className="flex flex-col gap-2">
          <NavLink
            to="/dashboard/lessons/new"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-white text-brand-500 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
          >
            <FiPlusCircle className="w-4 h-4" />
            Create Lesson
          </NavLink>
          <NavLink
            to="/dashboard/availability"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-white text-brand-500 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
          >
            <FiClock className="w-4 h-4" />
            Manage Availability
          </NavLink>
          <NavLink
            to="/dashboard/bookings"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 bg-white text-brand-500 rounded-lg text-sm font-medium hover:bg-brand-50 transition-colors"
          >
            <FiCalendar className="w-4 h-4" />
            View Bookings
          </NavLink>
        </div>
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

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-[280px] p-4 relative z-10">
            <SidebarContent />
          </aside>
        )}

        {/* Mobile Drawer */}
        {isMobile && sidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-40"
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
            <div className="fixed inset-y-0 left-0 w-[300px] bg-white z-50 shadow-xl animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <span className="text-lg font-bold text-brand-600">
                  Dashboard
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
                <SidebarContent onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 pt-8 lg:pt-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
