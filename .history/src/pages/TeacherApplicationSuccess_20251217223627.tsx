import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiMail,
  FiClock,
  FiArrowRight,
  FiInfo,
  FiHome,
  FiBookOpen,
  FiUser,
  FiVideo,
  FiStar,
} from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

export default function TeacherApplicationSuccess() {
  const steps = [
    {
      icon: FiMail,
      title: "Email Confirmation",
      description: "Check your inbox for application details",
      color: "blue",
    },
    {
      icon: FiClock,
      title: "Application Review",
      description: "Our team reviews your qualifications",
      color: "amber",
    },
    {
      icon: FiVideo,
      title: "Interview Process",
      description: "Brief video call if selected",
      color: "purple",
    },
    {
      icon: FiStar,
      title: "Start Teaching",
      description: "Set up profile and accept students",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Success Header */}
      <div className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          {/* Animated Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
              <FaCheckCircle className="w-14 h-14 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Application Submitted!
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto">
            Thank you for applying to become a Swahili teacher on Ztalk. We're
            excited to review your application.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm -mt-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Application Status: Under Review
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Expected response within 2-3 business days
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Pending
              </div>
            </div>
          </div>

          {/* Next Steps Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              What Happens Next?
            </h2>

            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const colorClasses = {
                  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
                  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
                  purple:
                    "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
                  green: "bg-green-100 dark:bg-green-900/30 text-green-600",
                };

                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[step.color as keyof typeof colorClasses]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex items-start">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs font-medium rounded-lg">
                        Step {index + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FiInfo className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  Have Questions?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  If you have any questions about your application or the
                  review process, feel free to contact our teacher support team
                  at{" "}
                  <a
                    href="mailto:teachers@ztalk.com"
                    className="font-semibold underline hover:no-underline"
                  >
                    teachers@ztalk.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-[1.02] transition-all w-full sm:w-auto"
            >
              <FiHome className="w-5 h-5" />
              Return to Homepage
            </Link>
            <Link
              to="/become-teacher"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
            >
              <FiBookOpen className="w-5 h-5" />
              Learn More About Teaching
            </Link>
          </div>

          {/* Profile Tip */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              While you wait, you can{" "}
              <Link
                to="/dashboard/settings"
                className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
              >
                complete your profile
              </Link>{" "}
              to get a head start!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
