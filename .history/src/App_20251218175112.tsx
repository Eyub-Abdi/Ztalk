import { Link as RouterLink, Navigate, Route, Routes } from "react-router-dom";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import LessonsDemoPage from "./pages/LessonsDemo";
import BecomeTeacher from "./pages/BecomeTeacher";
import TeacherApplication from "./pages/TeacherApplication";
import TeacherApplicationSuccess from "./pages/TeacherApplicationSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState, type ReactNode } from "react";
import {
  Hero,
  Offers,
  FeaturedTutors,
  Testimonials,
  FAQ,
  Footer,
  Spinner,
} from "./components";
import { useAuthModal } from "./features/auth/AuthModalProvider";
import { AuthModal } from "./features/auth/AuthModal";
import { useAuth } from "./features/auth/AuthProvider";
import DashboardLayout from "./features/dashboard/DashboardLayout";
import Overview from "./features/dashboard/Overview";
import Bookings from "./features/dashboard/Bookings";
import MyStudents from "./features/dashboard/MyStudents";
import Settings from "./features/dashboard/Settings";
import Availability from "./features/dashboard/Availability";
import CreateLesson from "./features/dashboard/CreateLesson";
import UpcomingLessons from "./features/dashboard/UpcomingLessons";
import Wallet from "./features/dashboard/Wallet";
import clsx from "clsx";

// Pages
function LandingPage() {
  return (
    <>
      <Hero />
      <Offers />
      <FeaturedTutors />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

// Placeholder for potential future page removed from nav
function PlaceholderPage() {
  return <div className="p-10">Placeholder Page</div>;
}

function NotFoundPage() {
  return (
    <div className="p-10">
      Page Not Found –{" "}
      <RouterLink to="/" className="text-brand-500 hover:underline">
        home
      </RouterLink>
    </div>
  );
}

// Layout
function Layout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const { isAuthenticated, logout } = useAuth();

  const onToggle = () => setIsOpen(!isOpen);
  const onClose = () => setIsOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-6 py-3 shadow-sm">
        <div className="flex items-center gap-6">
          <RouterLink
            to="/"
            className="text-2xl font-black bg-gradient-to-r from-gray-900 via-brand-600 to-indigo-600 bg-clip-text text-transparent hover:from-brand-600 hover:to-indigo-600 transition-all duration-200"
            onClick={onClose}
          >
            Ztalk
          </RouterLink>
          <div className="flex-1" />
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="btn btn-sm border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={openLogin}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/80 hover:border-gray-300 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={openSignup}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/80 hover:border-gray-300 transition-all"
                >
                  Sign Up
                </button>
                <RouterLink
                  to="/join-plus"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5"
                >
                  <span className="text-yellow-200">✦</span> Join Plus
                </RouterLink>
                <RouterLink
                  to="/become-teacher"
                  className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 rounded-xl hover:bg-brand-600 transition-all"
                >
                  Apply Now
                </RouterLink>
              </>
            )}
          </div>
          {/* Mobile menu toggle */}
          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={onToggle}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
        {/* Mobile menu content */}
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300 md:hidden",
            isOpen ? "max-h-48 mt-2" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-3 pt-2 pb-4 border-t border-gray-200">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="btn btn-sm w-full border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    onClose();
                    openLogin();
                  }}
                  className="py-2.5 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/80"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onClose();
                    openSignup();
                  }}
                  className="py-2.5 text-sm font-medium text-gray-700 bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-white/80"
                >
                  Sign Up
                </button>
                <RouterLink
                  to="/join-plus"
                  onClick={onClose}
                  className="py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center gap-1.5"
                >
                  <span className="text-yellow-200">✦</span> Join Plus
                </RouterLink>
                <RouterLink
                  to="/become-teacher"
                  onClick={onClose}
                  className="py-2.5 text-center text-sm font-semibold text-white bg-brand-500 rounded-xl"
                >
                  Apply Now
                </RouterLink>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <AuthModal />
    </div>
  );
}

// Protected Route wrapper for dashboard
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin } = useAuthModal();

  useEffect(() => {
    // Only trigger login modal after loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      const timer = window.setTimeout(() => openLogin(), 100);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, isAuthenticated, openLogin]);

  // Wait for auth state to initialize
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" color="brand" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <>
      <Routes>
        {/* Site routes with Layout (header) */}
        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/placeholder"
          element={
            <Layout>
              <PlaceholderPage />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <TermsPage />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPage />
            </Layout>
          }
        />
        <Route
          path="/lessons-demo"
          element={
            <Layout>
              <LessonsDemoPage />
            </Layout>
          }
        />
        <Route
          path="/become-teacher"
          element={
            <Layout>
              <BecomeTeacher />
            </Layout>
          }
        />
        <Route
          path="/teacher-application"
          element={
            <ProtectedRoute>
              <Layout>
                <TeacherApplication />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-application-success"
          element={
            <ProtectedRoute>
              <Layout>
                <TeacherApplicationSuccess />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Email verification route */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Dashboard routes without Layout (no site header) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="upcoming" element={<UpcomingLessons />} />
          <Route path="lessons/new" element={<CreateLesson />} />
          <Route path="availability" element={<Availability />} />
          <Route path="find-tutors" element={<MyStudents />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route
          path="*"
          element={
            <Layout>
              <NotFoundPage />
            </Layout>
          }
        />
      </Routes>

      {/* AuthModal available globally */}
      <AuthModal />
    </>
  );
}
