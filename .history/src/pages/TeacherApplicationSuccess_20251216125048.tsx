import { Link } from "react-router-dom";
import {
  FiCheckCircle,
  FiMail,
  FiClock,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";

export default function TeacherApplicationSuccess() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="space-y-8 text-center">
        {/* Success Icon */}
        <FiCheckCircle className="w-20 h-20 mx-auto text-green-500" />

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thank you for applying to become a Swahili teacher on Ztalk.
          </p>
        </div>

        {/* What Happens Next Alert */}
        <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-left">
          <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800 dark:text-green-200">
              What happens next?
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              Our team will carefully review your application and get back to
              you within 2-3 business days.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-left">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Next Steps:
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <FiMail className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Check your email</strong> - We&apos;ve sent you a
                confirmation with your application details.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiClock className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Application review</strong> - Our team will review your
                qualifications and teaching experience.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Interview process</strong> - If selected, we&apos;ll
                contact you for a brief interview.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiArrowRight className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">
                <strong>Start teaching</strong> - Once approved, you can set up
                your profile and start accepting students.
              </span>
            </li>
          </ul>
        </div>

        {/* Questions Alert */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left">
          <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-blue-800 dark:text-blue-200">
              Questions?
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              If you have any questions about your application or the process,
              feel free to contact us at teachers@ztalk.com
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <Link to="/" className="btn btn-primary px-8 py-3">
            Return to Homepage
          </Link>
          <Link to="/become-teacher" className="btn btn-outline px-8 py-3">
            Learn More About Teaching
          </Link>
        </div>
      </div>
    </div>
  );
}
