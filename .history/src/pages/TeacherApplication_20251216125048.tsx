import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import {
  FaGraduationCap,
  FaUsers,
  FaUser,
  FaCertificate,
  FaDollarSign,
  FaCheckCircle,
  FaPlus,
  FaTimes,
  FaCamera,
  FaChevronDown,
  FaBirthdayCake,
  FaStar,
  FaComments,
  FaGlobe,
  FaLanguage,
  FaChartBar,
  FaUpload,
  FaImage,
} from "react-icons/fa";
import { FiCheck, FiInfo } from "react-icons/fi";
import { useAuth } from "../features/auth/AuthProvider";

// Countries list
const countries = [
  { name: "Afghanistan", flag: "🇦🇫", code: "AF", dialCode: "+93" },
  { name: "Albania", flag: "🇦🇱", code: "AL", dialCode: "+355" },
  { name: "Algeria", flag: "🇩🇿", code: "DZ", dialCode: "+213" },
  { name: "Australia", flag: "🇦🇺", code: "AU", dialCode: "+61" },
  { name: "Austria", flag: "🇦🇹", code: "AT", dialCode: "+43" },
  { name: "Belgium", flag: "🇧🇪", code: "BE", dialCode: "+32" },
  { name: "Brazil", flag: "🇧🇷", code: "BR", dialCode: "+55" },
  { name: "Burundi", flag: "🇧🇮", code: "BI", dialCode: "+257" },
  { name: "Canada", flag: "🇨🇦", code: "CA", dialCode: "+1" },
  { name: "China", flag: "🇨🇳", code: "CN", dialCode: "+86" },
  {
    name: "Democratic Republic of Congo",
    flag: "🇨🇩",
    code: "CD",
    dialCode: "+243",
  },
  { name: "Egypt", flag: "🇪🇬", code: "EG", dialCode: "+20" },
  { name: "France", flag: "🇫🇷", code: "FR", dialCode: "+33" },
  { name: "Germany", flag: "🇩🇪", code: "DE", dialCode: "+49" },
  { name: "India", flag: "🇮🇳", code: "IN", dialCode: "+91" },
  { name: "Italy", flag: "🇮🇹", code: "IT", dialCode: "+39" },
  { name: "Japan", flag: "🇯🇵", code: "JP", dialCode: "+81" },
  { name: "Kenya", flag: "🇰🇪", code: "KE", dialCode: "+254" },
  { name: "Malawi", flag: "🇲🇼", code: "MW", dialCode: "+265" },
  { name: "Mozambique", flag: "🇲🇿", code: "MZ", dialCode: "+258" },
  { name: "Nigeria", flag: "🇳🇬", code: "NG", dialCode: "+234" },
  { name: "Rwanda", flag: "🇷🇼", code: "RW", dialCode: "+250" },
  { name: "Somalia", flag: "🇸🇴", code: "SO", dialCode: "+252" },
  { name: "South Africa", flag: "🇿🇦", code: "ZA", dialCode: "+27" },
  { name: "South Korea", flag: "🇰🇷", code: "KR", dialCode: "+82" },
  { name: "Spain", flag: "🇪🇸", code: "ES", dialCode: "+34" },
  { name: "Tanzania", flag: "🇹🇿", code: "TZ", dialCode: "+255" },
  { name: "Uganda", flag: "🇺🇬", code: "UG", dialCode: "+256" },
  { name: "United Kingdom", flag: "🇬🇧", code: "GB", dialCode: "+44" },
  { name: "United States", flag: "🇺🇸", code: "US", dialCode: "+1" },
  { name: "Zambia", flag: "🇿🇲", code: "ZM", dialCode: "+260" },
].sort((a, b) => a.name.localeCompare(b.name));

const getFlagUrl = (countryCode: string) =>
  `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;

const commonLanguages = [
  { name: "English", flag: "🇺🇸", code: "us" },
  { name: "Swahili", flag: "🇹🇿", code: "tz" },
  { name: "Arabic", flag: "🇸🇦", code: "sa" },
  { name: "French", flag: "🇫🇷", code: "fr" },
  { name: "Spanish", flag: "🇪🇸", code: "es" },
  { name: "Mandarin", flag: "🇨🇳", code: "cn" },
  { name: "Portuguese", flag: "🇧🇷", code: "br" },
  { name: "German", flag: "🇩🇪", code: "de" },
  { name: "Italian", flag: "🇮🇹", code: "it" },
  { name: "Japanese", flag: "🇯🇵", code: "jp" },
  { name: "Korean", flag: "🇰🇷", code: "kr" },
  { name: "Russian", flag: "🇷🇺", code: "ru" },
  { name: "Hindi", flag: "🇮🇳", code: "in" },
  { name: "Other", flag: "🌐", code: "world" },
];

const languageLevels = [
  {
    value: "native",
    label: "Native",
    description: "Your mother tongue",
    color: "purple",
  },
  {
    value: "c2",
    label: "C2 - Proficient",
    description: "Can understand virtually everything",
    color: "green",
  },
  {
    value: "c1",
    label: "C1 - Advanced",
    description: "Can express ideas fluently",
    color: "blue",
  },
  {
    value: "b2",
    label: "B2 - Upper Intermediate",
    description: "Can interact with fluency",
    color: "teal",
  },
  {
    value: "b1",
    label: "B1 - Intermediate",
    description: "Can deal with most situations",
    color: "orange",
  },
  {
    value: "a2",
    label: "A2 - Elementary",
    description: "Can communicate in simple tasks",
    color: "yellow",
  },
  {
    value: "a1",
    label: "A1 - Beginner",
    description: "Can use basic expressions",
    color: "red",
  },
];

const specialties = [
  "Beginner Swahili",
  "Business Swahili",
  "Conversational Practice",
  "Grammar & Structure",
  "Cultural Context",
  "Travel Swahili",
  "Academic Swahili",
  "Kids & Teens",
  "Exam Preparation",
];

const availabilitySlots = [
  "Monday Morning",
  "Monday Afternoon",
  "Monday Evening",
  "Tuesday Morning",
  "Tuesday Afternoon",
  "Tuesday Evening",
  "Wednesday Morning",
  "Wednesday Afternoon",
  "Wednesday Evening",
  "Thursday Morning",
  "Thursday Afternoon",
  "Thursday Evening",
  "Friday Morning",
  "Friday Afternoon",
  "Friday Evening",
  "Saturday Morning",
  "Saturday Afternoon",
  "Saturday Evening",
  "Sunday Morning",
  "Sunday Afternoon",
  "Sunday Evening",
];

const steps = [
  { title: "Teacher Type" },
  { title: "Personal Info" },
  { title: "Teaching Experience" },
  { title: "Video Introduction" },
  { title: "Availability" },
  { title: "Review" },
];

interface TeacherApplicationData {
  teacherType: "community" | "professional" | "";
  displayName: string;
  videoPlayform: string;
  zoomMeetingLink: string;
  zoomMeetingId: string;
  zoomPasscode: string;
  googleMeetLink: string;
  from: string;
  livingIn: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other" | "";
  streetAddress: string;
  city: string;
  country: string;
  nativeLanguage: string;
  otherLanguages: { language: string; level: string }[];
  profilePhoto: File | null;
  photoAgreement: boolean;
  teachingExperience: string;
  education: string;
  certifications: File[];
  specialties: string[];
  teachingStyle: string;
  videoFile: File | null;
  introText: string;
  hourlyRate: number;
  availability: string[];
  timezone: string;
  agreedToTerms: boolean;
}

const initialData: TeacherApplicationData = {
  teacherType: "",
  displayName: "",
  videoPlayform: "Ztalk Classroom",
  zoomMeetingLink: "",
  zoomMeetingId: "",
  zoomPasscode: "",
  googleMeetLink: "",
  from: "",
  livingIn: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  streetAddress: "",
  city: "",
  country: "",
  nativeLanguage: "",
  otherLanguages: [],
  profilePhoto: null,
  photoAgreement: false,
  teachingExperience: "",
  education: "",
  certifications: [],
  specialties: [],
  teachingStyle: "",
  videoFile: null,
  introText: "",
  hourlyRate: 15,
  availability: [],
  timezone: "",
  agreedToTerms: false,
};

// Dropdown Component
function Dropdown({
  placeholder,
  value,
  options,
  onChange,
  renderOption,
  renderSelected,
}: {
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  renderOption?: (opt: { value: string; label: string }) => React.ReactNode;
  renderSelected?: (opt: { value: string; label: string }) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {selected ? (
          renderSelected ? (
            renderSelected(selected)
          ) : (
            <span>{selected.label}</span>
          )
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <FaChevronDown
          className={clsx(
            "w-4 h-4 text-gray-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeacherApplication() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<TeacherApplicationData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        displayName: user.first_name || "",
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone_number || "",
      }));
    }
  }, [user]);

  const updateData = (
    field: keyof TeacherApplicationData,
    value:
      | string
      | number
      | boolean
      | string[]
      | File
      | File[]
      | null
      | { language: string; level: string }[]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0:
        if (!data.teacherType)
          newErrors.teacherType = "Please select a teacher type";
        break;
      case 1:
        if (!data.displayName)
          newErrors.displayName = "Display name is required";
        if (!data.from) newErrors.from = "Country of origin is required";
        if (!data.livingIn) newErrors.livingIn = "Current country is required";
        if (!data.firstName) newErrors.firstName = "First name is required";
        if (!data.lastName) newErrors.lastName = "Last name is required";
        if (!data.dateOfBirth)
          newErrors.dateOfBirth = "Date of birth is required";
        if (!data.gender) newErrors.gender = "Gender is required";
        if (!data.nativeLanguage)
          newErrors.nativeLanguage = "Native language is required";
        if (!data.profilePhoto)
          newErrors.profilePhoto = "Profile photo is required";
        if (!data.photoAgreement)
          newErrors.photoAgreement = "You must agree to photo requirements";
        break;
      case 2:
        if (!data.teachingExperience)
          newErrors.teachingExperience = "Teaching experience is required";
        if (!data.education)
          newErrors.education = "Education background is required";
        if (data.specialties.length === 0)
          newErrors.specialties = "Select at least one specialty";
        break;
      case 3:
        if (!data.videoFile)
          newErrors.videoFile = "Video introduction is required";
        break;
      case 4:
        if (data.hourlyRate < 10)
          newErrors.hourlyRate = "Minimum rate is $10/hour";
        if (data.availability.length === 0)
          newErrors.availability = "Select at least one slot";
        break;
      case 5:
        if (!data.agreedToTerms)
          newErrors.agreedToTerms = "You must agree to the terms";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => setActiveStep(activeStep - 1);

  const submitApplication = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    try {
      console.log("Submitting application:", data);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate("/teacher-application-success");
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const countryOptions = countries.map((c) => ({
    value: c.name,
    label: c.name,
  }));
  const languageOptions = commonLanguages.map((l) => ({
    value: l.name,
    label: l.name,
  }));
  const levelOptions = languageLevels.map((l) => ({
    value: l.value,
    label: l.label,
  }));

  const renderCountryOption = (opt: { value: string; label: string }) => {
    const country = countries.find((c) => c.name === opt.value);
    return (
      <div className="flex items-center gap-2">
        {country && (
          <img
            src={getFlagUrl(country.code)}
            alt=""
            className="w-5 h-4 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
        <span>{opt.label}</span>
      </div>
    );
  };

  const renderLanguageOption = (opt: { value: string; label: string }) => {
    const lang = commonLanguages.find((l) => l.name === opt.value);
    return (
      <div className="flex items-center gap-2">
        {lang?.code === "world" ? (
          <FaGlobe className="w-5 h-5 text-gray-500" />
        ) : (
          lang && (
            <img
              src={getFlagUrl(lang.code)}
              alt=""
              className="w-5 h-4 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )
        )}
        <span>{opt.label}</span>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Teaching Path
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                On Ztalk there are two types of teachers. Which one are you?
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Professional Teacher */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    updateData("teacherType", "professional");
                  }
                }}
                onClick={() => updateData("teacherType", "professional")}
                className={clsx(
                  "relative p-8 rounded-2xl cursor-pointer transition-all duration-300 border-[3px]",
                  data.teacherType === "professional"
                    ? "border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 shadow-xl"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 hover:-translate-y-1 hover:shadow-xl"
                )}
              >
                {data.teacherType === "professional" && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-bold flex items-center gap-1">
                    <FaCheckCircle size={12} /> Selected
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        data.teacherType === "professional"
                          ? "bg-blue-500"
                          : "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <FaGraduationCap
                        size={24}
                        className={
                          data.teacherType === "professional"
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Professional Teacher
                      </h3>
                      <p className="text-blue-600 font-medium">
                        Certified & Experienced
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Background
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Native or near-native speaker who is professionally
                        certified. 18+ years old.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaCertificate size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Credentials
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scanned documents showing professional training or
                        experience.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaDollarSign size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Earning Potential
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Set your own price.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Tutor */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    updateData("teacherType", "community");
                  }
                }}
                onClick={() => updateData("teacherType", "community")}
                className={clsx(
                  "relative p-8 rounded-2xl cursor-pointer transition-all duration-300 border-[3px]",
                  data.teacherType === "community"
                    ? "border-green-400 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 shadow-xl"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 hover:-translate-y-1 hover:shadow-xl"
                )}
              >
                {data.teacherType === "community" && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm font-bold flex items-center gap-1">
                    <FaCheckCircle size={12} /> Selected
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        data.teacherType === "community"
                          ? "bg-green-500"
                          : "bg-gray-100 dark:bg-gray-700"
                      )}
                    >
                      <FaUsers
                        size={24}
                        className={
                          data.teacherType === "community"
                            ? "text-white"
                            : "text-gray-400"
                        }
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Community Tutor
                      </h3>
                      <p className="text-green-600 font-medium">
                        Informal & Conversational
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaUser size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Background
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Native or near-native speaker that enjoys teaching
                        informally. 18+ years old.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaCertificate size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Credentials
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        None.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaDollarSign size={14} className="text-gray-500" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          Earning Potential
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Set your own price.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {errors.teacherType && (
              <p className="text-red-500 text-sm">{errors.teacherType}</p>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                2.1 Basic Information
              </h3>

              <div>
                <label
                  htmlFor="display-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Display Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={data.displayName}
                  onChange={(e) => updateData("displayName", e.target.value)}
                  className="input"
                  placeholder="Ayub Abdi"
                />
                {errors.displayName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Video Platform */}
              <div>
                <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Platform
                </p>
                <div className="space-y-3">
                  {["Ztalk Classroom", "zoom", "google-meet"].map(
                    (platform) => (
                      <div
                        key={platform}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            updateData("videoPlayform", platform);
                          }
                        }}
                        onClick={() => updateData("videoPlayform", platform)}
                        className={clsx(
                          "p-4 border-2 rounded-lg cursor-pointer transition-all",
                          data.videoPlayform === platform
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              data.videoPlayform === platform
                                ? "border-brand-500 bg-brand-500"
                                : "border-gray-300"
                            )}
                          >
                            {data.videoPlayform === platform && (
                              <FiCheck className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-semibold capitalize">
                            {platform === "google-meet"
                              ? "Google Meet"
                              : platform === "zoom"
                              ? "Zoom"
                              : platform}
                          </span>
                          {platform === "Ztalk Classroom" && (
                            <span className="badge bg-brand-100 text-brand-700 text-xs">
                              Default
                            </span>
                          )}
                        </div>
                        {platform === "zoom" &&
                          data.videoPlayform === "zoom" && (
                            <div
                              className="mt-3 space-y-2"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                className="input"
                                placeholder="Zoom meeting link"
                                value={data.zoomMeetingLink}
                                onChange={(e) =>
                                  updateData("zoomMeetingLink", e.target.value)
                                }
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  className="input"
                                  placeholder="Meeting ID"
                                  value={data.zoomMeetingId}
                                  onChange={(e) =>
                                    updateData("zoomMeetingId", e.target.value)
                                  }
                                />
                                <input
                                  className="input"
                                  placeholder="Passcode"
                                  value={data.zoomPasscode}
                                  onChange={(e) =>
                                    updateData("zoomPasscode", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        {platform === "google-meet" &&
                          data.videoPlayform === "google-meet" && (
                            <div
                              className="mt-3"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                className="input"
                                placeholder="Google Meet link"
                                value={data.googleMeetLink}
                                onChange={(e) =>
                                  updateData("googleMeetLink", e.target.value)
                                }
                              />
                            </div>
                          )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </p>
                  <Dropdown
                    placeholder="Select country of origin"
                    value={data.from}
                    options={countryOptions}
                    onChange={(v) => updateData("from", v)}
                    renderOption={renderCountryOption}
                    renderSelected={renderCountryOption}
                  />
                  {errors.from && (
                    <p className="text-red-500 text-sm mt-1">{errors.from}</p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Living in
                  </p>
                  <Dropdown
                    placeholder="Select current country"
                    value={data.livingIn}
                    options={countryOptions}
                    onChange={(v) => updateData("livingIn", v)}
                    renderOption={renderCountryOption}
                    renderSelected={renderCountryOption}
                  />
                  {errors.livingIn && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.livingIn}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Private Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                2.2 Private
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please make sure your information is identical to your
                government-issued ID.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    className="input"
                    placeholder="AYUB"
                    value={data.firstName}
                    onChange={(e) => updateData("firstName", e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    className="input"
                    placeholder="ABDI"
                    value={data.lastName}
                    onChange={(e) => updateData("lastName", e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    <FaBirthdayCake className="inline mr-2 text-brand-500" />
                    Birthday
                  </label>
                  <input
                    id="dob"
                    type="date"
                    className="input"
                    value={data.dateOfBirth}
                    onChange={(e) => updateData("dateOfBirth", e.target.value)}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </p>
                  <div className="flex gap-4">
                    {["male", "female", "other"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={data.gender === g}
                          onChange={(e) => updateData("gender", e.target.value)}
                          className="text-brand-500 focus:ring-brand-500"
                        />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Language Skills */}
            <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="w-6 h-6 text-brand-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  2.3 Language Skills
                </h3>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FaStar className="w-6 h-6 text-brand-500" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Native Language
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your mother tongue
                    </p>
                  </div>
                </div>
                <Dropdown
                  placeholder="Select your native language"
                  value={data.nativeLanguage}
                  options={languageOptions}
                  onChange={(v) => updateData("nativeLanguage", v)}
                  renderOption={renderLanguageOption}
                  renderSelected={renderLanguageOption}
                />
                {errors.nativeLanguage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nativeLanguage}
                  </p>
                )}
              </div>

              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaComments className="w-6 h-6 text-green-500" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Additional Languages
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add other languages you speak
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateData("otherLanguages", [
                        ...data.otherLanguages,
                        { language: "", level: "" },
                      ])
                    }
                    className="btn btn-primary btn-sm flex items-center gap-2"
                  >
                    <FaPlus /> Add Language
                  </button>
                </div>

                {data.otherLanguages.length === 0 ? (
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
                    <FaGlobe className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No additional languages yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.otherLanguages.map((lang, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                            #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateData(
                                "otherLanguages",
                                data.otherLanguages.filter(
                                  (_, i) => i !== index
                                )
                              )
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                              <FaLanguage className="text-brand-500" /> Language
                            </p>
                            <Dropdown
                              placeholder="Select language"
                              value={lang.language}
                              options={languageOptions}
                              onChange={(value) => {
                                const newLanguages = [...data.otherLanguages];
                                newLanguages[index] = {
                                  ...lang,
                                  language: value,
                                };
                                updateData("otherLanguages", newLanguages);
                              }}
                              renderOption={renderLanguageOption}
                              renderSelected={renderLanguageOption}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                              <FaChartBar className="text-green-500" />{" "}
                              Proficiency
                            </p>
                            <Dropdown
                              placeholder="Select level"
                              value={lang.level}
                              options={levelOptions}
                              onChange={(value) => {
                                const newLanguages = [...data.otherLanguages];
                                newLanguages[index] = { ...lang, level: value };
                                updateData("otherLanguages", newLanguages);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Profile Photo */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-6">
                <FaCamera className="w-6 h-6 text-purple-500" />
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    2.4 Profile Photo
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a professional photo
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Preview
                  </p>
                  <div
                    className={clsx(
                      "w-48 h-48 mx-auto rounded-full border-[3px] overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center",
                      data.profilePhoto ? "border-green-300" : "border-gray-300"
                    )}
                  >
                    {data.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(data.profilePhoto!)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className={clsx(
                      "p-8 border-2 border-dashed rounded-xl text-center transition-all",
                      data.profilePhoto
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 bg-gray-50 dark:bg-gray-800 hover:border-brand-300"
                    )}
                  >
                    {data.profilePhoto ? (
                      <FaCheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    ) : (
                      <FaUpload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    )}
                    <p className="font-semibold mb-2">
                      {data.profilePhoto
                        ? "Photo Uploaded!"
                        : "Upload Your Photo"}
                    </p>
                    {data.profilePhoto && (
                      <p className="text-sm text-green-600">
                        {data.profilePhoto.name}
                      </p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        updateData("profilePhoto", e.target.files?.[0] || null)
                      }
                      className="hidden"
                      id="profile-photo"
                    />
                    <label
                      htmlFor="profile-photo"
                      className={clsx(
                        "btn mt-4 cursor-pointer inline-block",
                        data.profilePhoto ? "btn-outline" : "btn-primary"
                      )}
                    >
                      {data.profilePhoto ? "Change Photo" : "Choose Photo"}
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FaImage className="text-blue-500" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                        Requirements
                      </span>
                    </div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Minimum 250×250 pixels</li>
                      <li>• JPG, PNG, or BMP format</li>
                      <li>• Maximum 2MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {errors.profilePhoto && (
                <p className="text-red-500 text-sm mt-4">
                  {errors.profilePhoto}
                </p>
              )}

              <label className="flex items-start gap-3 mt-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.photoAgreement}
                  onChange={(e) =>
                    updateData("photoAgreement", e.target.checked)
                  }
                  className="mt-1"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I&apos;m aware that if my profile photo does not respect the
                  listed characteristics, my application could be rejected.
                </span>
              </label>
              {errors.photoAgreement && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photoAgreement}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-3 py-1">
                4
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Teaching Experience
              </h3>
            </div>

            <div>
              <label
                htmlFor="teaching-experience"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Describe your teaching experience
              </label>
              <textarea
                id="teaching-experience"
                rows={4}
                className="input"
                placeholder="Years of experience, age groups taught, teaching environments..."
                value={data.teachingExperience}
                onChange={(e) =>
                  updateData("teachingExperience", e.target.value)
                }
              />
              {errors.teachingExperience && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.teachingExperience}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Education Background
              </label>
              <textarea
                id="education"
                rows={3}
                className="input"
                placeholder="Educational qualifications, degrees, and relevant training..."
                value={data.education}
                onChange={(e) => updateData("education", e.target.value)}
              />
              {errors.education && (
                <p className="text-red-500 text-sm mt-1">{errors.education}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="certifications"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Certifications (Optional)
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Upload teaching certificates (PDF only)
              </p>
              <input
                id="certifications"
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) =>
                  updateData("certifications", Array.from(e.target.files || []))
                }
                className="input"
              />
              {data.certifications.length > 0 && (
                <div className="mt-2 space-y-1">
                  {data.certifications.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <FaCertificate className="text-brand-500" />
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateData(
                            "certifications",
                            data.certifications.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-500 hover:text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teaching Specialties
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select all areas you&apos;re comfortable teaching:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {specialties.map((specialty) => (
                  <label
                    key={specialty}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.specialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateData("specialties", [
                            ...data.specialties,
                            specialty,
                          ]);
                        } else {
                          updateData(
                            "specialties",
                            data.specialties.filter((s) => s !== specialty)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{specialty}</span>
                  </label>
                ))}
              </div>
              {errors.specialties && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.specialties}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="teaching-style"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Teaching Style
              </label>
              <textarea
                id="teaching-style"
                rows={3}
                className="input"
                placeholder="Describe your teaching methodology..."
                value={data.teachingStyle}
                onChange={(e) => updateData("teachingStyle", e.target.value)}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  Video Introduction
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Record a 2-3 minute video introducing yourself in Swahili and
                  English.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="intro-video"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Video Introduction
              </label>
              <input
                id="intro-video"
                type="file"
                accept="video/*"
                onChange={(e) =>
                  updateData("videoFile", e.target.files?.[0] || null)
                }
                className="input"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Max 100MB. Formats: MP4, MOV, AVI
              </p>
              {errors.videoFile && (
                <p className="text-red-500 text-sm mt-1">{errors.videoFile}</p>
              )}
            </div>

            {data.videoFile && (
              <div>
                <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Video Preview:
                </p>
                <video
                  controls
                  className="w-full max-w-xl rounded-lg"
                  src={URL.createObjectURL(data.videoFile!)}
                >
                  <track kind="captions" />
                </video>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="hourly-rate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Hourly Rate (USD)
              </label>
              <input
                id="hourly-rate"
                type="number"
                min="10"
                max="100"
                value={data.hourlyRate}
                onChange={(e) =>
                  updateData("hourlyRate", parseInt(e.target.value) || 15)
                }
                className="input w-32"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Recommended: $15-25/hour
              </p>
              {errors.hourlyRate && (
                <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="timezone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Timezone
              </label>
              <select
                id="timezone"
                className="input"
                value={data.timezone}
                onChange={(e) => updateData("timezone", e.target.value)}
              >
                <option value="">Select timezone</option>
                <option value="Africa/Dar_es_Salaam">
                  East Africa Time (EAT)
                </option>
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">GMT</option>
                <option value="America/New_York">EST</option>
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Availability
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Select time slots when you&apos;re available:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {availabilitySlots.map((slot) => (
                  <label
                    key={slot}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={data.availability.includes(slot)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateData("availability", [
                            ...data.availability,
                            slot,
                          ]);
                        } else {
                          updateData(
                            "availability",
                            data.availability.filter((s) => s !== slot)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{slot}</span>
                  </label>
                ))}
              </div>
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.availability}
                </p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Review Your Application
            </h3>

            <div className="card p-6 space-y-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.firstName} {data.lastName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{data.email}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.city}, {data.country}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Teaching Focus
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="badge bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Rate & Availability
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  ${data.hourlyRate}/hour
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.availability.length} time slots selected
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.agreedToTerms}
                onChange={(e) => updateData("agreedToTerms", e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the Terms of Service and Privacy Policy for teachers
              </span>
            </label>
            {errors.agreedToTerms && (
              <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>
            )}

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <FiInfo className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  Next Steps
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  After submission, our team will review your application within
                  2-3 business days.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Teacher Application
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join our community of Swahili educators
          </p>
        </div>

        {/* Stepper */}
        <div className="hidden md:flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  index < activeStep
                    ? "bg-brand-500 text-white"
                    : index === activeStep
                    ? "bg-brand-500 text-white ring-4 ring-brand-200"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}
              >
                {index < activeStep ? <FiCheck /> : index + 1}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 lg:w-16 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile Progress */}
        <div className="md:hidden flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {steps[activeStep].title}
          </span>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {activeStep + 1} of {steps.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-brand-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Form Content */}
        <div className="card p-4 md:p-8">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className="btn btn-outline w-full md:w-auto order-2 md:order-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="hidden md:block text-sm text-gray-600 dark:text-gray-400 order-1 md:order-2">
            Step {activeStep + 1} of {steps.length}
          </span>

          {activeStep === steps.length - 1 ? (
            <button
              onClick={submitApplication}
              disabled={isSubmitting}
              className="btn btn-primary w-full md:w-auto order-3"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="btn btn-primary w-full md:w-auto order-3"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
