import { Link as RouterLink, Navigate, Route, Routes } from "react-router-dom";
import TermsPage from "./pages/Terms";
import PrivacyPage from "./pages/Privacy";
import LessonsDemoPage from "./pages/LessonsDemo";
import BecomeTeacher from "./pages/BecomeTeacher";
import JoinPlus from "./pages/JoinPlus";
import TeacherApplication from "./pages/TeacherApplication";
import TeacherApplicationSuccess from "./pages/TeacherApplicationSuccess";
import VerifyEmail from "./pages/VerifyEmail";
import CompleteRegistration from "./pages/CompleteRegistration";
import ResetPasswordConfirm from "./pages/ResetPasswordConfirm";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { StudentDashboardLayout } from "./features/dashboard/StudentDashboardLayout";
import StudentOverview from "./features/dashboard/StudentOverview";
import StudentFindTutors from "./features/dashboard/StudentFindTutors";
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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-[1000] bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-lg shadow-black/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <RouterLink
                to="/"
                className="text-2xl font-black bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent hover:from-brand-700 hover:to-indigo-700 transition-all duration-300"
                onClick={onClose}
              >
                Ztalk
              </RouterLink>
            </motion.div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RouterLink
                      to="/join-plus"
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="text-yellow-200 text-lg">✦</span> Join
                      Plus
                    </RouterLink>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RouterLink
                      to="/become-teacher"
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 flex items-center"
                    >
                      Apply Now
                    </RouterLink>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openLogin}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openSignup}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RouterLink
                      to="/join-plus"
                      className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="text-yellow-200 text-lg">✦</span> Join
                      Plus
                    </RouterLink>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RouterLink
                      to="/become-teacher"
                      className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 flex items-center"
                    >
                      Apply Now
                    </RouterLink>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              onClick={onToggle}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile menu content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-200/60 bg-white/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col gap-3 py-6">
                  {isAuthenticated ? (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RouterLink
                          to="/join-plus"
                          onClick={onClose}
                          className="py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center gap-2"
                        >
                          <span className="text-yellow-200 text-lg">✦</span>{" "}
                          Join Plus
                        </RouterLink>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RouterLink
                          to="/become-teacher"
                          onClick={onClose}
                          className="py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300"
                        >
                          Apply Now
                        </RouterLink>
                      </motion.div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onClose();
                          logout();
                        }}
                        className="py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onClose();
                          openLogin();
                        }}
                        className="py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                      >
                        Login
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onClose();
                          openSignup();
                        }}
                        className="py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      >
                        Sign Up
                      </motion.button>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RouterLink
                          to="/join-plus"
                          onClick={onClose}
                          className="py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center gap-2"
                        >
                          <span className="text-yellow-200 text-lg">✦</span>{" "}
                          Join Plus
                        </RouterLink>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RouterLink
                          to="/become-teacher"
                          onClick={onClose}
                          className="py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300"
                        >
                          Apply Now
                        </RouterLink>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
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
  const { isAuthenticated } = useAuth();
  return (
    <div>
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
          path="/join-plus"
          element={
            <Layout>
              <JoinPlus />
            </Layout>
          }
        />
        <Route
          path="/apply"
          element={
            <Layout>
              <Apply />
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
        <Route path="/verify-email/:token/*" element={<VerifyEmail />} />

        {/* Complete registration route */}
        <Route
          path="/complete-registration/:token"
          element={<CompleteRegistration />}
        />

        {/* Password reset confirm page */}
        <Route
          path="/reset-password/confirm/:token?"
          element={
            <Layout>
              <ResetPasswordConfirm />
            </Layout>
          }
        />

        {/* Teacher Dashboard routes without Layout (no site header) */}
        <Route
          path="/dashboard/teacher"
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

        {/* Student Dashboard routes without Layout */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="find-tutors" element={<StudentFindTutors />} />
          <Route path="my-lessons" element={<Bookings />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="upcoming" element={<UpcomingLessons />} />
          <Route path="favorites" element={<StudentOverview />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Redirect old routes to new structure */}
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/teacher" replace />}
        />
        <Route
          path="/student-dashboard/*"
          element={<Navigate to="/dashboard/student" replace />}
        />

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
    </div>
  );
}
