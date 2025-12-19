import { NavLink, Outlet } from "react-router-dom";
import {
  FiCalendar,
  FiHome,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiClock,
  FiBookOpen,
  FiX,
  FiDollarSign,
  FiSearch,
  FiStar,
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
  onLogout,
}: {
  displayUser: { first_name: string; last_name: string; email: string };
  user: User | null;
  onMenuToggle?: () => void;
  onLogout?: () => void;
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
              My Learning
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back,{" "}
              <span className="font-medium text-gray-700">
                {displayUser.first_name}
              </span>
            </p>
          </div>
        </div>

        {/* Right side - Notifications + User menu */}
        <div className="flex items-center gap-3">
          {/* Notification bell */}
          <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors hidden sm:block">
            <FiBell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-3 md:px-4 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {displayUser.first_name[0]?.toUpperCase() || "S"}
              </div>
              <span className="hidden md:block font-medium text-gray-700 text-sm">
                {displayUser.first_name} {displayUser.last_name}
              </span>
              <FiChevronDown
                className={clsx(
                  "w-4 h-4 text-gray-500 transition-transform",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown menu */}
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-20 animate-fade-in">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {displayUser.first_name} {displayUser.last_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {displayUser.email}
                    </p>
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">
                      Student Account
                    </span>
                  </div>

                  {/* Menu items */}
                  <div className="py-1 px-2">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 rounded-xl group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                        <FiUser className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                      </div>
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 rounded-xl group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                        <FiSettings className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                      </div>
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-150 rounded-xl group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                        <FiHelpCircle className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                      </div>
                      <span>Help & Support</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onLogout?.();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-150 rounded-xl group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors">
                        <FiLogOut className="w-4 h-4" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
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
    first_name: "Student",
    last_name: "User",
    email: "student@example.com",
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Navigation Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
        <nav className="flex flex-col gap-1.5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
            Menu
          </p>
          <NavItem
            to="/dashboard/student"
            icon={FiHome}
            label="Overview"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/find-tutors"
            icon={FiSearch}
            label="Find Tutors"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/my-lessons"
            icon={FiBookOpen}
            label="My Lessons"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/bookings"
            icon={FiCalendar}
            label="My Bookings"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/upcoming"
            icon={FiClock}
            label="Upcoming Lessons"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/favorites"
            icon={FiStar}
            label="Favorite Tutors"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/wallet"
            icon={FiDollarSign}
            label="Wallet"
            onClick={onClose}
          />
          <NavItem
            to="/dashboard/student/settings"
            icon={FiSettings}
            label="Settings"
            onClick={onClose}
          />
        </nav>
      </div>
    </div>
  );
}

export function StudentDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const displayUser = user || {
    first_name: "Student",
    last_name: "User",
    email: "student@example.com",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <DashboardHeader
        displayUser={displayUser}
        user={user}
        onMenuToggle={() => setSidebarOpen(true)}
        onLogout={logout}
      />

      <div className="flex max-w-[2000px] mx-auto">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 px-6 py-8 border-r border-gray-200/60">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar */}
        {isMobile && (
          <>
            {/* Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar drawer */}
            <aside
              className={clsx(
                "fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-br from-gray-50 via-white to-gray-50 z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              )}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiX className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <SidebarContent onClose={() => setSidebarOpen(false)} />
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
