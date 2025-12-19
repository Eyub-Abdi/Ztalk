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
  FiSidebar,
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
  isCollapsed,
}: {
  to: string;
  icon: IconType;
  label: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        clsx(
          "flex items-center justify-center rounded-xl transition-all duration-200 group",
          isCollapsed ? "w-11 h-11 mx-auto" : "gap-3 px-4 py-3 min-h-[48px]",
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
              "w-6 h-6",
              isActive
                ? "text-white"
                : "text-gray-500 group-hover:text-brand-500"
            )}
          />
          {!isCollapsed && (
            <span className={clsx("font-medium", isActive && "font-semibold")}>
              {label}
            </span>
          )}
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
          {/* Join Plus Button */}
          <a
            href="/join-plus"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
          >
            <span className="text-yellow-200">✦</span> Join Plus
          </a>

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
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                  {/* Profile Header */}
                  <div className="px-6 py-5 bg-gradient-to-r from-brand-500/5 via-brand-500/10 to-brand-600/5 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                        {displayUser?.first_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {displayUser?.first_name} {displayUser?.last_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {displayUser?.email}
                        </p>
                        <p className="text-xs text-brand-600 font-medium mt-1">
                          {user ? "Student" : "Demo User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all duration-150 rounded-xl group">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                        <FiUser className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                      </div>
                      <span>View Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all duration-150 rounded-xl group">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                        <FiSettings className="w-4 h-4 text-gray-500 group-hover:text-brand-600" />
                      </div>
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-all duration-150 rounded-xl group">
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

function SidebarContent({
  onClose,
  onSidebarToggle,
  isCollapsed,
}: {
  onClose?: () => void;
  onSidebarToggle?: () => void;
  isCollapsed?: boolean;
}) {
  const { user } = useAuth();

  const displayUser = user || {
    first_name: "Demo",
    last_name: "User",
    email: "demo@example.com",
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Navigation Card */}
      <div
        className={clsx(
          "bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow",
          isCollapsed ? "p-3" : "p-5"
        )}
      >
        <nav className="flex flex-col gap-1.5">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Menu
              </p>
              <button
                onClick={onSidebarToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <FiSidebar className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center mb-3">
              <button
                onClick={onSidebarToggle}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Expand sidebar"
              >
                <FiSidebar className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}
          <NavItem
            to="/dashboard/student"
            icon={FiHome}
            label="Overview"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/find-tutors"
            icon={FiSearch}
            label="Find Tutors"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/my-lessons"
            icon={FiBookOpen}
            label="My Lessons"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/bookings"
            icon={FiCalendar}
            label="My Bookings"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/upcoming"
            icon={FiClock}
            label="Upcoming Lessons"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/favorites"
            icon={FiStar}
            label="Favorite Tutors"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/wallet"
            icon={FiDollarSign}
            label="Wallet"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/dashboard/student/settings"
            icon={FiSettings}
            label="Settings"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>
    </div>
  );
}

export function StudentDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        displayUser={displayUser}
        user={user}
        onMenuToggle={() => setSidebarOpen(true)}
        onLogout={logout}
      />

      <div className="flex">
        {/* Desktop Sidebar - Fixed */}
        <aside
          className={clsx(
            "bg-gray-50 flex-shrink-0 fixed top-[89px] left-0 h-[calc(100vh-89px)] z-30 transition-all duration-300 ease-in-out",
            isMobile
              ? "-translate-x-full"
              : sidebarVisible
              ? "w-[300px] translate-x-0"
              : "w-[80px] translate-x-0"
          )}
        >
          <div
            className={clsx(
              "transition-all duration-300 ease-in-out",
              sidebarVisible ? "p-6" : "pt-6 px-3 pb-3"
            )}
          >
            <SidebarContent
              onSidebarToggle={() => setSidebarVisible(!sidebarVisible)}
              isCollapsed={!sidebarVisible}
            />
          </div>
        </aside>

        {/* Sidebar spacer for fixed sidebar */}
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out",
            isMobile ? "w-0" : sidebarVisible ? "w-[300px]" : "w-[80px]"
          )}
        />

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
        <main className="flex-1 px-6 lg:px-10 py-2 lg:py-3 min-h-[calc(100vh-89px)] transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
