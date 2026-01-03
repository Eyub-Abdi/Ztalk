import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { clsx } from "clsx";
import axios from "axios";
import { API_BASE_URL } from "../lib/http";
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
  FaGlobe,
  FaLanguage,
  FaChartBar,
  FaUpload,
  FaImage,
  FaPlay,
  FaClipboardCheck,
  FaChalkboardTeacher,
} from "react-icons/fa";
import {
  FiCheck,
  FiCheckCircle,
  FiInfo,
  FiUser,
  FiBriefcase,
  FiVideo,
  FiFileText,
  FiChevronRight,
  FiChevronLeft,
  FiShield,
  FiAward,
  FiZap,
  FiCalendar,
} from "react-icons/fi";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../features/auth/AuthProvider";
import {
  useApplicationDraft,
  useSaveApplicationDraft,
  useDeleteApplicationDraft,
} from "../features/tutor-application/api/useApplicationDraft";
import { useTeachableLanguages } from "../features/tutor-application/api/useTeachableLanguages";
type CountryItem = {
  name: string;
  code?: string;
  flag_emoji?: string;
  flag_url?: string;
};
type LanguageItem = {
  id: number;
  name: string;
  code: string;
  native_name: string;
  flag_image: string;
  native_countries: CountryItem[];
};

// Local draft storage key helper
const getDraftStorageKey = (email?: string) =>
  `teacher-application-draft:${email || "anon"}`;

// API response type for native languages endpoint
interface NativeLanguagesApiResponse {
  success: boolean;
  message: string;
  data: {
    native_languages: LanguageItem[];
    allowed_countries: CountryItem[];
    total: number;
    filter: {
      country_code: string | null;
      description: string;
    };
    note: string;
  };
  errors: null;
}

// Remove non-serializable fields like File objects before storage
const sanitizeDataForStorage = (data: TeacherApplicationData) => ({
  ...data,
  profilePhoto: null,
  videoFile: null,
  certifications: data.certifications.map(cert => ({
    ...cert,
    attachment: null, // Remove File object from certificates
  })),
});
// API function to fetch native languages and allowed countries
const fetchAllowedCountries = async () => {
  console.log(
    "Fetching native languages from:",
    `${API_BASE_URL}/teachers/languages/native/`
  );
  const response = await axios.get<NativeLanguagesApiResponse>(
    `${API_BASE_URL}/teachers/languages/native/`,
    {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Accept: "application/json",
      },
    }
  );
  if (response.data?.success && response.data?.data) {
    return {
      allowed_countries: response.data.data.allowed_countries || [],
      native_languages: response.data.data.native_languages || [],
    };
  }
  throw new Error("Unexpected response when fetching native languages");
};
// Hook for native languages and allowed countries
const useNativeLanguagesAndCountries = () => {
  return useQuery<{
    allowed_countries: CountryItem[];
    native_languages: LanguageItem[];
  }>({
    queryKey: ["native-languages-countries"],
    queryFn: fetchAllowedCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// API function to fetch all countries (for livingIn)
const fetchAllCountries = async () => {
  console.log(
    "Fetching all countries from:",
    `${API_BASE_URL}/teachers/all-countries/`
  );
  const response = await axios.get(`${API_BASE_URL}/teachers/all-countries/`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Accept: "application/json",
    },
  });
  if (response.data?.success && response.data?.data?.countries) {
    return response.data.data.countries;
  }
  // Some backends may reuse the same shape as allowed_countries
  if (response.data?.success && response.data?.data?.all_countries) {
    return response.data.data.all_countries;
  }
  throw new Error("Unexpected response when fetching all countries");
};

// Hook for all countries (for livingIn)
const useAllCountries = () => {
  return useQuery<CountryItem[]>({
    queryKey: ["all-countries"],
    queryFn: fetchAllCountries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// API function to fetch teaching materials
const fetchTeachingMaterials = async () => {
  const response = await axios.get(`${API_BASE_URL}/teachers/teaching-materials/`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Accept: "application/json",
    },
  });
  if (response.data?.success && response.data?.data?.materials) {
    return response.data.data.materials;
  }
  throw new Error("Unexpected response when fetching teaching materials");
};

// Hook for teaching materials
const useTeachingMaterials = () => {
  return useQuery<{ value: string; label: string }[]>({
    queryKey: ["teaching-materials"],
    queryFn: fetchTeachingMaterials,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Languages are now fetched as part of the allowed countries API

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
  "PDF file",
  "Text Documents",
  "Presentation slides/PPT",
  "Audio files",
  "Image files",
  "Video files",
  "Flashcards",
  "Articles and news",
  "Quizzes",
  "Test templates and examples",
  "Graphs and charts",
  "Homework Assignments",
];

const teachingStyles = [
  "Music",
  "Sports & Fitness",
  "Food",
  "Films & TV Series",
  "Reading",
  "Writing",
  "Art",
  "History",
  "Science",
  "Business & Finance",
  "Medical & Healthcare",
  "Tech",
  "Pets & Animals",
  "Gaming",
  "Travel",
  "Legal Services",
  "Marketing",
  "Fashion & Beauty",
  "Education",
  "Certifications",
  "Teaching Methodology",
  "Specializations",
];

const steps = [
  { title: "Teacher Type", icon: FiAward, description: "Choose your path" },
  {
    title: "Personal Info",
    icon: FiUser,
    description: "Tell us about yourself",
  },
  {
    title: "Teaching Experience",
    icon: FiBriefcase,
    description: "Share your background",
  },
  {
    title: "Teaching Specialization",
    icon: FaStar,
    description: "Your expertise areas",
  },
  {
    title: "Video Introduction",
    icon: FiVideo,
    description: "Record your intro",
  },
  { title: "Review", icon: FiFileText, description: "Confirm and submit" },
];

interface EducationEntry {
  id: string;
  fromYear: string;
  toYear: string;
  institution: string;
  major: string;
  degree: string;
  description: string;
}

interface TeachingExperienceEntry {
  id: string;
  fromYear: string;
  toYear: string;
  position: string;
  company: string;
  description: string;
}

interface SpecialtyCertificate {
  id: string;
  name: string;
  institution: string;
  type: string;
  yearIssued: string;
  expiryYear: string;
  description: string;
  attachment: File | null;
}

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
  educationEntries: EducationEntry[];
  teachingExperienceEntries: TeachingExperienceEntry[];
  certifications: SpecialtyCertificate[];
  specialties: string[];
  teachingStyles: string[];
  videoFile: File | null;
  introText: string;
  youtubePublishConsent: boolean;
  webcamConfirmation: boolean;
  teacherBio: string;
  agreedToTerms: boolean;
}

const initialData: TeacherApplicationData = {
  teacherType: "",
  displayName: "",
  videoPlayform: "zoom",
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
  educationEntries: [],
  teachingExperienceEntries: [],
  certifications: [],
  specialties: [],
  teachingStyles: [],
  videoFile: null,
  introText: "",
  youtubePublishConsent: false,
  webcamConfirmation: false,
  teacherBio: "",
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
  const [filterText, setFilterText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
        setFilterText("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  // Filter options based on search text - show countries starting with typed letters
  const filteredOptions = filterText
    ? options.filter((opt) =>
        opt.label.toLowerCase().startsWith(filterText.toLowerCase().trim())
      )
    : options;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle letter keys, space, and control keys
    if (e.key.length === 1 && /[a-zA-Z\s]/.test(e.key)) {
      e.preventDefault();
      setFilterText((prev) => prev + e.key);
      setOpen(true);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setFilterText((prev) => prev.slice(0, -1));
      if (!open) setOpen(true);
    } else if (e.key === "Escape") {
      setOpen(false);
      setFilterText("");
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(!open);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        className={clsx(
          "w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all duration-200",
          open
            ? "border-brand-500 ring-4 ring-brand-500/20"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        )}
      >
        <div className="flex-1">
          {selected ? (
            renderSelected ? (
              renderSelected(selected)
            ) : (
              <span className="font-medium text-gray-900 dark:text-white">
                {selected.label}
              </span>
            )
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          {filterText && (
            <div className="text-xs text-brand-600 dark:text-brand-400 mt-1">
              Filtering: {filterText}
            </div>
          )}
        </div>
        <FaChevronDown
          className={clsx(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
              {filterText ? (
                <>No options found starting with &ldquo;{filterText}&rdquo;</>
              ) : (
                "No options available"
              )}
            </div>
          ) : (
            filteredOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setFilterText("");
                }}
                className={clsx(
                  "w-full px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg",
                  opt.value === value
                    ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {renderOption ? renderOption(opt) : <span>{opt.label}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Custom DatePicker Component
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Parse current value or use defaults
  const currentYear = new Date().getFullYear();
  const parsed = value ? new Date(value) : null;

  const [selectedDay, setSelectedDay] = useState<number | null>(
    parsed ? parsed.getDate() : null
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    parsed ? parsed.getMonth() : null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(
    parsed ? parsed.getFullYear() : null
  );
  const [viewMonth, setViewMonth] = useState(
    parsed ? parsed.getMonth() : new Date().getMonth()
  );
  const [viewYear, setViewYear] = useState(
    parsed ? parsed.getFullYear() : currentYear - 25
  );
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  // Generate years (18+ years old requirement, up to 60 years)
  const years = Array.from({ length: 60 }, (_, i) => currentYear - 18 - i);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target as Node)
      ) {
        setMonthDropdownOpen(false);
      }
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target as Node)
      ) {
        setYearDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update parent when selection changes
  useEffect(() => {
    if (selectedDay && selectedMonth !== null && selectedYear) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(
        2,
        "0"
      )}-${String(selectedDay).padStart(2, "0")}`;
      // Only notify parent if the value actually changes
      if (value !== dateStr) {
        onChange(dateStr);
      }
    }
  }, [selectedDay, selectedMonth, selectedYear, value, onChange]);

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setSelectedMonth(viewMonth);
    setSelectedYear(viewYear);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const displayValue = parsed
    ? `${
        MONTHS[parsed.getMonth()]
      } ${parsed.getDate()}, ${parsed.getFullYear()}`
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={clsx(
          "w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all duration-200",
          open
            ? "border-brand-500 ring-4 ring-brand-500/20"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
        )}
      >
        {displayValue ? (
          <span className="font-medium text-gray-900 dark:text-white">
            {displayValue}
          </span>
        ) : (
          <span className="text-gray-400">Select your birthday</span>
        )}
        <FiCalendar className="w-5 h-5 text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl p-4">
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            <div className="flex items-center gap-2">
              {/* Month Dropdown */}
              <div ref={monthDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setMonthDropdownOpen(!monthDropdownOpen);
                    setYearDropdownOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                    monthDropdownOpen
                      ? "bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  {MONTHS[viewMonth]}
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 transition-transform",
                      monthDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {monthDropdownOpen && (
                  <div className="absolute z-50 mt-1 left-0 w-36 max-h-48 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
                    {MONTHS.map((month, idx) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          setViewMonth(idx);
                          setMonthDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                          idx === viewMonth
                            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Dropdown */}
              <div ref={yearDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setYearDropdownOpen(!yearDropdownOpen);
                    setMonthDropdownOpen(false);
                  }}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all",
                    yearDropdownOpen
                      ? "bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  {viewYear}
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 transition-transform",
                      yearDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {yearDropdownOpen && (
                  <div className="absolute z-50 mt-1 right-0 w-24 max-h-48 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
                    {years.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setViewYear(year);
                          setYearDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-3 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                          year === viewYear
                            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before first day of month */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-9" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const isSelected =
                selectedDay === day &&
                selectedMonth === viewMonth &&
                selectedYear === viewYear;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={clsx(
                    "h-9 rounded-lg text-sm font-medium transition-all",
                    isSelected
                      ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/30"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Generate years for education dropdowns
const currentYear = new Date().getFullYear();
const educationYears = Array.from({ length: 50 }, (_, i) =>
  String(currentYear - i)
);

const degreeOptions = [
  { value: "high_school", label: "High School Diploma" },
  { value: "associate", label: "Associate Degree" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate (PhD)" },
  { value: "certificate", label: "Certificate/Diploma" },
  { value: "other", label: "Other" },
];

// Certificate type options
const certificateTypes = [
  { value: "certification", label: "Certification" },
  { value: "award", label: "Award" },
  { value: "license", label: "License" },
  { value: "course_completion", label: "Course Completion" },
  { value: "other", label: "Other" },
];

// Teaching Experience Form Component
function TeachingExperienceForm({
  onAddEntry,
}: {
  onAddEntry: (entry: TeachingExperienceEntry) => void;
}) {
  const [formData, setFormData] = useState<TeachingExperienceEntry>({
    id: "",
    fromYear: "",
    toYear: "",
    position: "",
    company: "",
    description: "",
  });

  const handleSubmit = () => {
    if (
      !formData.fromYear ||
      !formData.toYear ||
      !formData.position ||
      !formData.company
    ) {
      return; // Basic validation
    }

    const newEntry = {
      ...formData,
      id: Date.now().toString(),
    };

    onAddEntry(newEntry);

    // Reset form
    setFormData({
      id: "",
      fromYear: "",
      toYear: "",
      position: "",
      company: "",
      description: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          Add New Teaching Experience
        </h4>
      </div>

      {/* From / To Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </p>
          <Dropdown
            placeholder="Select year"
            value={formData.fromYear}
            options={educationYears.map((y) => ({
              value: y,
              label: y,
            }))}
            onChange={(value) => {
              setFormData({ ...formData, fromYear: value });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </p>
          <Dropdown
            placeholder="Select year"
            value={formData.toYear}
            options={[
              { value: "Present", label: "Present" },
              ...educationYears.map((y) => ({
                value: y,
                label: y,
              })),
            ]}
            onChange={(value) => {
              setFormData({ ...formData, toYear: value });
            }}
          />
        </div>
      </div>

      {/* Position / Company Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position / Title
          </p>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => {
              setFormData({ ...formData, position: e.target.value });
            }}
            placeholder="e.g. Somali Teacher"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company / Institution
          </p>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => {
              setFormData({ ...formData, company: e.target.value });
            }}
            placeholder="e.g. Somali Language Academy"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value.slice(0, 500),
            });
          }}
          placeholder="Describe your responsibilities and achievements"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {formData.description.length}/500
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          !formData.fromYear ||
          !formData.toYear ||
          !formData.position ||
          !formData.company
        }
        className="w-full px-4 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
      >
        Add Experience
      </button>
    </div>
  );
}

// Education Form Component
function EducationForm({
  onAddEntry,
}: {
  onAddEntry: (entry: EducationEntry) => void;
}) {
  const [formData, setFormData] = useState<EducationEntry>({
    id: "",
    fromYear: "",
    toYear: "",
    institution: "",
    major: "",
    degree: "",
    description: "",
  });

  const handleSubmit = () => {
    if (
      !formData.fromYear ||
      !formData.toYear ||
      !formData.institution ||
      !formData.major ||
      !formData.degree
    ) {
      return; // Basic validation
    }

    const newEntry = {
      ...formData,
      id: Date.now().toString(),
    };

    onAddEntry(newEntry);

    // Reset form
    setFormData({
      id: "",
      fromYear: "",
      toYear: "",
      institution: "",
      major: "",
      degree: "",
      description: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          Add New Education
        </h4>
      </div>

      {/* From / To / Institution Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From
          </p>
          <Dropdown
            placeholder="Select year"
            value={formData.fromYear}
            options={educationYears.map((y) => ({
              value: y,
              label: y,
            }))}
            onChange={(value) => {
              setFormData({ ...formData, fromYear: value });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To
          </p>
          <Dropdown
            placeholder="Select year"
            value={formData.toYear}
            options={[
              { value: "Present", label: "Present" },
              ...educationYears.map((y) => ({
                value: y,
                label: y,
              })),
            ]}
            onChange={(value) => {
              setFormData({ ...formData, toYear: value });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution
          </p>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => {
              setFormData({ ...formData, institution: e.target.value });
            }}
            placeholder="e.g. University of Mogadishu"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Major / Degree Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field of Study / Major
          </p>
          <input
            type="text"
            value={formData.major}
            onChange={(e) => {
              setFormData({ ...formData, major: e.target.value });
            }}
            placeholder="e.g. Education, Linguistics"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Degree Type
          </p>
          <Dropdown
            placeholder="Select degree"
            value={formData.degree}
            options={degreeOptions}
            onChange={(value) => {
              setFormData({ ...formData, degree: value });
            }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value.slice(0, 500),
            });
          }}
          placeholder="Describe the focus of your studies"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {formData.description.length}/500
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={
          !formData.fromYear ||
          !formData.toYear ||
          !formData.institution ||
          !formData.major ||
          !formData.degree
        }
        className="w-full px-4 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
      >
        Add Education
      </button>
    </div>
  );
}

// Specialty Certificate Form Component
function SpecialtyCertificateForm({
  onAddEntry,
}: {
  onAddEntry: (entry: SpecialtyCertificate) => void;
}) {
  const [formData, setFormData] = useState<SpecialtyCertificate>({
    id: "",
    name: "",
    institution: "",
    type: "certification",
    yearIssued: "",
    expiryYear: "",
    description: "",
    attachment: null,
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.type) {
      return; // Basic validation
    }

    const newEntry = {
      ...formData,
      id: Date.now().toString(),
    };

    onAddEntry(newEntry);

    // Reset form
    setFormData({
      id: "",
      name: "",
      institution: "",
      type: "certification",
      yearIssued: "",
      expiryYear: "",
      description: "",
      attachment: null,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          Add New Certificate
        </h4>
      </div>

      {/* Name / Institution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Certificate Name <span className="text-red-500">*</span>
          </p>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
            placeholder="e.g. TESOL Certificate"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution
          </p>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => {
              setFormData({ ...formData, institution: e.target.value });
            }}
            placeholder="e.g. Cambridge University"
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Type / Year Issued / Expiry Year Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type <span className="text-red-500">*</span>
          </p>
          <Dropdown
            placeholder="Select type"
            value={formData.type}
            options={certificateTypes}
            onChange={(value) => {
              setFormData({ ...formData, type: value });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Year Issued
          </p>
          <Dropdown
            placeholder="Select year"
            value={formData.yearIssued}
            options={educationYears.map((y) => ({
              value: y,
              label: y,
            }))}
            onChange={(value) => {
              setFormData({ ...formData, yearIssued: value });
            }}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expiry Year
          </p>
          <Dropdown
            placeholder="Never expires"
            value={formData.expiryYear}
            options={[
              { value: "never", label: "Never expires" },
              ...educationYears.map((y) => ({
                value: y,
                label: y,
              })),
            ]}
            onChange={(value) => {
              setFormData({ ...formData, expiryYear: value });
            }}
          />
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Certificate Document
        </p>
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/50">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setFormData({ ...formData, attachment: file });
            }}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
          />
          {formData.attachment && (
            <p className="text-xs text-gray-500 mt-2">
              Selected: {formData.attachment.name}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </p>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => {
            setFormData({
              ...formData,
              description: e.target.value.slice(0, 500),
            });
          }}
          placeholder="Describe the certificate and its relevance to teaching"
          className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
        />
        <p className="text-right text-xs text-gray-400 mt-1">
          {formData.description.length}/500
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!formData.name || !formData.type}
        className="w-full px-4 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all"
      >
        Add Certificate
      </button>
    </div>
  );
}

export default function TeacherApplication() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<TeacherApplicationData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();

  // Auto-hide toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // React Query hooks for draft management
  const { data: savedDraft, isLoading: isDraftLoading } = useApplicationDraft(
    !!user
  );
  const saveDraftMutation = useSaveApplicationDraft();
  const deleteDraftMutation = useDeleteApplicationDraft();

  // Language availability hooks
  const {
    data: teachableLanguages,
    isLoading: isLoadingTeachableLanguages,
    error: teachableLanguagesError,
  } = useTeachableLanguages();
  const {
    data: allowedCountriesData,
    isLoading: isLoadingCountries,
    error: countriesError,
  } = useNativeLanguagesAndCountries();

  // Teaching materials hook
  const {
    data: teachingMaterials,
    isLoading: isLoadingTeachingMaterials,
    error: teachingMaterialsError,
  } = useTeachingMaterials();

  // Extract data from the combined API response
  const allowedCountries = allowedCountriesData?.allowed_countries || [];
  const nativeLanguages = useMemo(
    () => allowedCountriesData?.native_languages || [],
    [allowedCountriesData?.native_languages]
  );
  const isLoadingLanguages = isLoadingCountries;
  const languagesError = countriesError;

  // Stable object URL for video preview to avoid recreation issues
  useEffect(() => {
    if (!data.videoFile) {
      setVideoPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(data.videoFile);
    setVideoPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [data.videoFile]);

  // Load saved draft on mount
  useEffect(() => {
    if (isInitialized || isDraftLoading) return;

    const storageKey = getDraftStorageKey(user?.email);
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey)
        : null;

    if (savedDraft) {
      setActiveStep(savedDraft.step);
      const draftData = savedDraft.data as Partial<TeacherApplicationData>;
      // Remove null file fields to preserve uploaded files
      const { profilePhoto, videoFile, certifications, ...restData } = draftData;
      setData((prev) => ({
        ...prev,
        ...restData,
        // Only update certifications if they exist, preserving attachments
        ...(certifications && certifications.length > 0 && {
          certifications: certifications.map((cert, index) => ({
            ...cert,
            // Preserve existing attachment if new cert doesn't have one
            attachment: cert.attachment || prev.certifications[index]?.attachment || null,
          })),
        }),
      }));
      setIsInitialized(true);
    } else if (raw) {
      try {
        const parsed = JSON.parse(raw) as {
          step?: number;
          data?: Partial<TeacherApplicationData>;
        };
        if (parsed) {
          if (typeof parsed.step === "number") setActiveStep(parsed.step);
          if (parsed.data) {
            const { profilePhoto, videoFile, certifications, ...restData } = parsed.data;
            // Remove null file fields to preserve uploaded files
            setData((prev) => ({
              ...prev,
              ...restData,
              // Only update certifications if they exist, preserving attachments
              ...(certifications && certifications.length > 0 && {
                certifications: certifications.map((cert, index) => ({
                  ...cert,
                  // Preserve existing attachment if new cert doesn't have one
                  attachment: cert.attachment || prev.certifications[index]?.attachment || null,
                })),
              }),
            }));
          }
        }
      } catch (e) {
        console.warn("Failed to parse local draft:", e);
      }
      setIsInitialized(true);
    } else {
      setIsInitialized(true);
    }
  }, [savedDraft, isDraftLoading, isInitialized, user]);

  // Debounced save - persist locally and to backend when available
  useEffect(() => {
    if (!isInitialized) return;

    const timeoutId = setTimeout(() => {
      const draft = {
        step: activeStep,
        data: sanitizeDataForStorage(data),
      };

      // Local persistence (works for both logged-in and guest)
      try {
        const storageKey = getDraftStorageKey(user?.email);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(storageKey, JSON.stringify(draft));
        }
      } catch (e) {
        console.warn("Failed to save local draft:", e);
      }

      // Backend draft (if user exists and endpoint enabled)
      if (user) {
        saveDraftMutation.mutate(draft);
      }
    }, 800); // Slightly faster debounce for better UX

    return () => clearTimeout(timeoutId);
  }, [activeStep, data, isInitialized, user, saveDraftMutation]);

  useEffect(() => {
    if (user) {
      setData((prev) => ({
        ...prev,
        displayName: user.first_name || prev.displayName || "",
        firstName: user.first_name || prev.firstName || "",
        lastName: user.last_name || prev.lastName || "",
        email: user.email || prev.email || "",
        phone: user.phone_number || prev.phone || "",
      }));
    }
  }, [user]);

  const updateData = useCallback(
    (
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
        | EducationEntry[]
        | TeachingExperienceEntry[]
        | SpecialtyCertificate[]
    ) => {
      // Avoid redundant updates to prevent unnecessary re-renders/loops
      setData((prev) => {
        const current = prev[field] as unknown;
        const isPrimitiveOrNull = value === null || typeof value !== "object";
        if (isPrimitiveOrNull && current === (value as unknown)) {
          return prev; // no change
        }
        return { ...prev, [field]: value };
      });
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Clear native language when "from" country changes and current selection is no longer valid
  useEffect(() => {
    if (data.nativeLanguage && data.from && nativeLanguages.length > 0) {
      const selectedLanguage = nativeLanguages.find(
        (lang) => lang.name === data.nativeLanguage
      );
      if (selectedLanguage) {
        const isValidForCountry = selectedLanguage.native_countries.some(
          (country) => country.name === data.from
        );
        if (!isValidForCountry) {
          updateData("nativeLanguage", "");
        }
      }
    }
  }, [data.from, data.nativeLanguage, nativeLanguages, updateData]);

  const addEducationEntry = (entry: EducationEntry) => {
    setData((prev) => ({
      ...prev,
      educationEntries: [...prev.educationEntries, entry],
    }));
  };

  const removeEducationEntry = (id: string) => {
    setData((prev) => ({
      ...prev,
      educationEntries: prev.educationEntries.filter((e) => e.id !== id),
    }));
  };

  const addTeachingExperienceEntry = (entry: TeachingExperienceEntry) => {
    setData((prev) => ({
      ...prev,
      teachingExperienceEntries: [...prev.teachingExperienceEntries, entry],
    }));
  };

  const removeTeachingExperienceEntry = (id: string) => {
    setData((prev) => ({
      ...prev,
      teachingExperienceEntries: prev.teachingExperienceEntries.filter(
        (e) => e.id !== id
      ),
    }));
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
        // Validate native language matches the selected "from" country
        if (data.nativeLanguage && data.from) {
          const selectedLanguage = nativeLanguages.find(
            (lang) => lang.name === data.nativeLanguage
          );
          if (selectedLanguage) {
            const isValidForCountry = selectedLanguage.native_countries.some(
              (country) => country.name === data.from
            );
            if (!isValidForCountry) {
              newErrors.nativeLanguage = `This native language is not available for ${data.from}`;
            }
          }
        }
        // Validate languages taught - need at least one language at Native/C2 level that's available
        {
          const teachableLanguagesFromList = data.otherLanguages.filter(
            (lang) =>
              lang.language &&
              lang.level &&
              (lang.level === "native" || lang.level === "c2")
          );
          const hasUnavailableLanguage = teachableLanguagesFromList.some(
            (lang) => {
              const availability = teachableLanguages?.find(
                (l) => l.name === lang.language
              );
              return availability && !availability.available;
            }
          );
          if (teachableLanguagesFromList.length === 0) {
            newErrors.otherLanguages =
              "Please add at least one language you want to teach (Native or C2 level required)";
          } else if (hasUnavailableLanguage) {
            newErrors.otherLanguages =
              "One or more selected languages are not available for teaching";
          }
        }
        if (!data.profilePhoto)
          newErrors.profilePhoto = "Profile photo is required";
        if (!data.photoAgreement)
          newErrors.photoAgreement = "You must agree to photo requirements";
        break;
      case 2:
        if (data.educationEntries.length === 0)
          newErrors.educationEntries =
            "Please add at least one education entry";
        if (!data.teacherBio || data.teacherBio.trim().length < 50)
          newErrors.teacherBio =
            "Please write a teacher bio (minimum 50 characters)";
        if (data.certifications.length === 0)
          newErrors.certifications = "Please add at least one certificate";
        break;
      case 3:
        if (data.specialties.length === 0)
          newErrors.specialties = "Select at least one specialty";
        break;
      case 4:
        if (!data.videoFile)
          newErrors.videoFile = "Video introduction is required";
        else if (data.videoFile.size > 500 * 1024 * 1024)
          newErrors.videoFile = "Video file must be 500MB or smaller";
        if (!data.introText || data.introText.trim().length < 100)
          newErrors.introText =
            "Please write an introduction (minimum 100 characters)";
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

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const submitApplication = async () => {
    if (!validateStep(activeStep)) return;
    setIsSubmitting(true);
    try {
      // Get country codes from the selected country names
      const fromCountry = allowedCountries.find((c) => c.name === data.from);
      const livingInCountry = allCountries?.find(
        (c) => c.name === data.livingIn
      );

      // Helper function to convert File to base64 object
      const convertFileToBase64Object = async (file: File | null | undefined) => {
        if (!file || !(file instanceof File)) {
          return null;
        }
        const base64Content = await fileToBase64(file);
        return {
          filename: file.name,
          content: base64Content,
          content_type: file.type,
        };
      };

      // Convert files to base64
      console.log("Profile photo:", data.profilePhoto);
      console.log("Video file:", data.videoFile);
      
      const profilePictureBase64 = data.profilePhoto instanceof File
        ? await convertFileToBase64Object(data.profilePhoto)
        : null;

      const introductionVideoBase64 = data.videoFile instanceof File
        ? await convertFileToBase64Object(data.videoFile)
        : null;

      console.log("Profile picture base64 object:", profilePictureBase64);
      console.log("Introduction video base64 object:", introductionVideoBase64);

      // Convert certificate attachments to base64
      const certificatesWithAttachments = await Promise.all(
        data.certifications.map(async (cert) => {
          const certData: any = {
            name: cert.name,
            institution: cert.institution,
            type: cert.type,
            year_issued: parseInt(cert.yearIssued),
            ...(cert.expiryYear && { expiry_year: parseInt(cert.expiryYear) }),
            ...(cert.description && { description: cert.description }),
          };

          if (cert.attachment instanceof File) {
            const attachmentBase64 = await convertFileToBase64Object(cert.attachment);
            console.log("Certificate attachment base64:", attachmentBase64);
            certData.attachment = attachmentBase64;
          }

          return certData;
        })
      );
      
      console.log("Certificates with attachments:", certificatesWithAttachments);

      // Languages
      const otherLanguages =
        data.otherLanguages.length > 0
          ? data.otherLanguages.map((lang) => ({
              language: lang.language,
              proficiency_level: lang.level,
              can_teach_beginners:
                lang.level === "native" ||
                lang.level === "c2" ||
                lang.level === "c1",
              can_teach_advanced:
                lang.level === "native" || lang.level === "c2",
            }))
          : [];

      // Video platform - normalize google-meet to google_meet
      const platform =
        data.videoPlayform === "google-meet"
          ? "google_meet"
          : data.videoPlayform;

      // Truncate to max 50 chars per item
      const materials = data.specialties.map((item) => item.substring(0, 50));
      const interests = data.teachingStyles.map((item) =>
        item.substring(0, 50)
      );

      // Build the JSON payload
      const payload: any = {
        teacher_type: data.teacherType,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        country_from: fromCountry?.code || data.from,
        country_living_in: livingInCountry?.code || data.livingIn,
        city_living_in: data.city || "Not specified",
        native_language: data.nativeLanguage,
        other_languages: otherLanguages,
        education_entries: data.educationEntries.map((entry) => ({
          institution: entry.institution,
          degree: entry.degree,
          major: entry.major,
          start_year: parseInt(entry.fromYear),
          end_year: parseInt(entry.toYear),
          description: entry.description,
        })),
        teaching_experience_entries: data.teachingExperienceEntries.map((entry) => ({
          institution: entry.company,
          position: entry.position,
          start_year: parseInt(entry.fromYear),
          end_year: parseInt(entry.toYear),
          country: livingInCountry?.code || data.country,
          city: data.city,
          description: entry.description,
        })),
        specialty_certificates: certificatesWithAttachments,
        about_me: data.introText,
        me_as_teacher: data.teacherBio,
        teaching_materials: materials,
        teaching_interests: interests,
        preferred_platform: platform,
        terms_accepted: data.agreedToTerms,
        privacy_policy_accepted: data.agreedToTerms,
        internet_ready: true,
        video_webcam_available: data.webcamConfirmation,
        video_agrees_to_publishing: data.youtubePublishConsent,
      };

      // Add platform-specific fields
      if (data.videoPlayform === "zoom") {
        payload.zoom_meeting_link = data.zoomMeetingLink;
        payload.zoom_personal_meeting_id = data.zoomMeetingId;
        payload.zoom_meeting_password = data.zoomPasscode;
      } else if (data.videoPlayform === "google-meet") {
        payload.google_meet_link = data.googleMeetLink;
      }

      // Add files
      if (profilePictureBase64) {
        payload.profile_picture = profilePictureBase64;
      }
      if (introductionVideoBase64) {
        payload.introduction_video = introductionVideoBase64;
      }

      console.log("Submitting application with JSON payload");
      console.log("Payload:", JSON.stringify(payload, null, 2));

      // Submit to backend
      await axios.post(`${API_BASE_URL}/teachers/apply/`, payload, {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });

      deleteDraftMutation.mutate(); // Clear saved draft after successful submission
      // Clear local draft
      try {
        const storageKey = getDraftStorageKey(user?.email);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(storageKey);
        }
      } catch (e) {
        console.warn("Failed to clear local draft:", e);
      }
      navigate("/teacher-application-success");
    } catch (error: any) {
      console.error("Submission failed:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      // Extract error message from backend response
      let errorMessage = "Failed to submit application. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;
        console.log("Detailed error data:", JSON.stringify(errorData, null, 2));

        // Check for nested error structure (multiple possible formats)
        if (errorData.errors?.detail) {
          // Token errors: { errors: { detail: "...", code: "..." } }
          errorMessage = errorData.errors.detail;
        } else if (errorData.errors?.error) {
          // Application errors: { errors: { error: "..." } }
          errorMessage = errorData.errors.error;
        } else if (errorData.detail) {
          // Direct detail field
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          // Direct error field
          errorMessage = errorData.error;
        } else if (errorData.message && errorData.message !== "Error") {
          // Message field (only if not generic "Error")
          errorMessage = errorData.message;
        } else if (typeof errorData.errors === "string") {
          // Errors as a string
          errorMessage = errorData.errors;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setToastMessage({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Country options for 'from' (only allowed countries from API)
  const allowedCountryOptions = allowedCountries.map((c) => ({
    value: c.name,
    label: c.name,
    code: c.code,
    flagEmoji: c.flag_emoji,
    flagUrl: c.flag_url,
  }));

  // Country options for 'livingIn' (from backend)
  const {
    data: allCountries,
    isLoading: isLoadingAllCountries,
    error: allCountriesError,
  } = useAllCountries();
  const allCountryOptions = (allCountries || []).map((c) => ({
    value: c.name,
    label: c.name,
    code: c.code,
    flagEmoji: c.flag_emoji,
    flagUrl: c.flag_url,
  }));

  // Filter native languages based on selected "from" country
  const availableLanguagesForCountry = data.from
    ? nativeLanguages.filter((lang) =>
        lang.native_countries.some((country) => country.name === data.from)
      )
    : nativeLanguages;

  const languageOptions =
    availableLanguagesForCountry && availableLanguagesForCountry.length > 0
      ? availableLanguagesForCountry.map((l) => ({
          value: l.name,
          label: l.name,
        }))
      : commonLanguages.map((l) => ({ value: l.name, label: l.name }));

  // Languages for "Languages Taught" dropdown come exclusively from
  // the /teachers/languages/availability/ API via useTeachableLanguages.
  // We no longer fall back to native-language or country-based lists here
  // to keep this logic fully separate from country/native endpoints.
  const teachableLanguageOptions = (teachableLanguages || []).map((l) => ({
    value: l.name,
    label: l.name,
  }));

  const languageCodeMap: Record<string, string | undefined> =
    Object.fromEntries((nativeLanguages || []).map((l) => [l.name, l.code]));

  const languageFlagMap: Record<string, string | undefined> =
    Object.fromEntries(
      (nativeLanguages || []).map((l) => [l.name, l.flag_image])
    );
  const levelOptions = languageLevels.map((l) => ({
    value: l.value,
    label: l.label,
  }));

  const renderCountryOption = (opt: {
    value: string;
    label: string;
    code?: string;
    flagEmoji?: string;
    flagUrl?: string;
  }) => {
    // For allowed countries (with code and flag from API)
    if (opt.code && (opt.flagUrl || opt.flagEmoji)) {
      return (
        <div className="flex items-center gap-2">
          {opt.flagUrl ? (
            <img src={opt.flagUrl} alt="" className="w-5 h-4 object-cover" />
          ) : (
            <span className="text-lg">{opt.flagEmoji}</span>
          )}
          <span>{opt.label}</span>
        </div>
      );
    }
    // For regular countries (fallback to static list)
    const country = countries.find((c) => c.name === opt.value);
    return (
      <div className="flex items-center gap-2">
        {country && <span className="text-lg">{country.flag}</span>}
        <span>{opt.label}</span>
      </div>
    );
  };

  const renderSelectedCountry = (opt: {
    value: string;
    label: string;
    code?: string;
    flagEmoji?: string;
    flagUrl?: string;
  }) => {
    // For allowed countries (with code and flag from API)
    if (opt.code && (opt.flagUrl || opt.flagEmoji)) {
      return (
        <div className="flex items-center gap-2">
          {opt.flagUrl ? (
            <img src={opt.flagUrl} alt="" className="w-5 h-4 object-cover" />
          ) : (
            <span className="text-lg">{opt.flagEmoji}</span>
          )}
          <span>{opt.label}</span>
        </div>
      );
    }
    // For regular countries (fallback to static list)
    const country = countries.find((c) => c.name === opt.value);
    return (
      <div className="flex items-center gap-2">
        {country && <span className="text-lg">{country.flag}</span>}
        <span>{opt.label}</span>
      </div>
    );
  };

  // Renderer specifically for the "Languages Taught" dropdown.
  // This uses only data from the /teachers/languages/availability/ API
  // (via useTeachableLanguages) and does not depend on native languages
  // or country logic.
  const renderTeachableLanguageOption = (opt: {
    value: string;
    label: string;
  }) => {
    const teachable = teachableLanguages?.find((l) => l.name === opt.value);
    const flagImage = teachable?.flagImage || null;

    return (
      <div className="flex items-center gap-2">
        {flagImage ? (
          <img
            src={flagImage}
            alt={opt.label}
            className="w-5 h-4 object-cover rounded-sm"
          />
        ) : (
          <FaGlobe className="w-5 h-5 text-gray-500" />
        )}
        <span>{opt.label}</span>
      </div>
    );
  };

  const renderLanguageOption = (opt: { value: string; label: string }) => {
    const flagImageFromApi = languageFlagMap[opt.value];
    const codeFromApi = languageCodeMap[opt.value];
    const lang = commonLanguages.find((l) => l.name === opt.value);
    return (
      <div className="flex items-center gap-2">
        {flagImageFromApi ? (
          <img
            src={flagImageFromApi}
            alt=""
            className="w-5 h-4 object-cover rounded-sm"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : codeFromApi ? (
          <img
            src={getFlagUrl(codeFromApi)}
            alt=""
            className="w-5 h-4 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : lang?.code === "world" ? (
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white mb-4">
                <FiAward className="w-8 h-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Choose Your Teaching Path
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                On Ztalk there are two types of teachers. Select the one that
                best describes you.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  "group relative p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden",
                  data.teacherType === "professional"
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 hover:-translate-y-1 hover:shadow-xl"
                )}
              >
                {/* Background decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full transition-transform group-hover:scale-150" />

                {data.teacherType === "professional" && (
                  <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2.5 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <FaCheckCircle size={10} /> Selected
                  </div>
                )}
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        data.teacherType === "professional"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                      )}
                    >
                      <FaGraduationCap
                        size={24}
                        className={clsx(
                          "transition-colors",
                          data.teacherType === "professional"
                            ? "text-white"
                            : "text-gray-400 group-hover:text-blue-500"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Professional Teacher
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                        Certified & Experienced
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FaUser size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Background
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Native speaker with professional certification. 18+
                          years old.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FaCertificate size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Credentials
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scanned documents showing training or experience.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FaDollarSign size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Earning Potential
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Set your own competitive rates
                        </p>
                      </div>
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
                  "group relative p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden",
                  data.teacherType === "community"
                    ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 shadow-xl shadow-green-500/20 ring-4 ring-green-500/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300 hover:-translate-y-1 hover:shadow-xl"
                )}
              >
                {/* Background decoration */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 rounded-full transition-transform group-hover:scale-150" />

                {data.teacherType === "community" && (
                  <div className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2.5 py-1 rounded-bl-xl rounded-tr-xl text-xs font-semibold flex items-center gap-1 shadow-lg">
                    <FaCheckCircle size={10} /> Selected
                  </div>
                )}
                <div className="relative space-y-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        data.teacherType === "community"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
                          : "bg-gray-100 dark:bg-gray-700 group-hover:bg-green-100 dark:group-hover:bg-green-900/30"
                      )}
                    >
                      <FaUsers
                        size={24}
                        className={clsx(
                          "transition-colors",
                          data.teacherType === "community"
                            ? "text-white"
                            : "text-gray-400 group-hover:text-green-500"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Community Tutor
                      </h3>
                      <p className="text-green-600 dark:text-green-400 font-medium text-sm">
                        Informal & Conversational
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <FaUser size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Background
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Native speaker who enjoys teaching informally. 18+
                          years old.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <FaCertificate size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Credentials
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          No formal certification required
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <FaDollarSign size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Earning Potential
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Set your own flexible rates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {errors.teacherType && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                <FiInfo className="w-5 h-5 flex-shrink-0" />
                {errors.teacherType}
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white mb-3">
                <FiUser className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Tell us about yourself
              </p>
            </div>

            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Basic Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Your public profile details
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="display-name"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Display Name
                </label>
                <input
                  id="display-name"
                  type="text"
                  value={data.displayName}
                  onChange={(e) => updateData("displayName", e.target.value)}
                  className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
                  placeholder="Ayub Abdi"
                />
                {errors.displayName && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                    <FiInfo className="w-4 h-4" />
                    {errors.displayName}
                  </p>
                )}
              </div>

              {/* Video Platform */}
              <div>
                <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Video Platform
                </p>
                <div className="space-y-3">
                  {/* "Ztalk Classroom" - Coming soon */}
                  {["zoom", "google-meet"].map((platform) => (
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
                        "p-4 border-2 rounded-xl cursor-pointer transition-all",
                        data.videoPlayform === platform
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-4 ring-brand-500/10"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            data.videoPlayform === platform
                              ? "border-brand-500 bg-brand-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {data.videoPlayform === platform && (
                            <FiCheck className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                          {platform === "google-meet"
                            ? "Google Meet"
                            : platform === "zoom"
                            ? "Zoom"
                            : platform}
                        </span>
                        {/* Ztalk Classroom badge - Coming soon
                          {platform === "Ztalk Classroom" && (
                            <span className="px-2 py-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold rounded-full">
                              Recommended
                            </span>
                          )}
                          */}
                      </div>
                      {platform === "zoom" && data.videoPlayform === "zoom" && (
                        <div
                          className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-gray-700"
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
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
                            placeholder="Zoom meeting link"
                            value={data.zoomMeetingLink}
                            onChange={(e) =>
                              updateData("zoomMeetingLink", e.target.value)
                            }
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
                              placeholder="Meeting ID"
                              value={data.zoomMeetingId}
                              onChange={(e) =>
                                updateData("zoomMeetingId", e.target.value)
                              }
                            />
                            <input
                              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
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
                            className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700"
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
                              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
                              placeholder="Google Meet link"
                              value={data.googleMeetLink}
                              onChange={(e) =>
                                updateData("googleMeetLink", e.target.value)
                              }
                            />
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    From <span className="text-red-500">*</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Teacher applications are only accepted from certain
                    countries
                  </p>
                  {isLoadingCountries ? (
                    <div className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center gap-2">
                      <Spinner />
                      <span className="text-gray-500">
                        Loading countries...
                      </span>
                    </div>
                  ) : countriesError ? (
                    <div className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-xl">
                      <p className="text-red-600 text-sm">
                        Failed to load countries. Please refresh the page.
                      </p>
                    </div>
                  ) : allowedCountryOptions.length === 0 ? (
                    <div className="w-full px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-xl">
                      <p className="text-yellow-600 text-sm">
                        No allowed countries found. Please contact support.
                      </p>
                    </div>
                  ) : (
                    <Dropdown
                      placeholder="Select country of origin"
                      value={data.from}
                      options={allowedCountryOptions}
                      onChange={(v) => updateData("from", v)}
                      renderOption={renderCountryOption}
                      renderSelected={renderSelectedCountry}
                    />
                  )}
                  {errors.from && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.from}
                    </p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Living in <span className="text-red-500">*</span>
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    You can currently live in any country
                  </p>
                  {isLoadingAllCountries ? (
                    <div className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center gap-2">
                      <Spinner />
                      <span className="text-gray-500">
                        Loading countries...
                      </span>
                    </div>
                  ) : allCountriesError ? (
                    <div className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-xl">
                      <p className="text-red-600 text-sm">
                        Failed to load countries. Please refresh the page.
                      </p>
                    </div>
                  ) : allCountryOptions.length === 0 ? (
                    <div className="w-full px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-xl">
                      <p className="text-yellow-600 text-sm">
                        No countries found. Please contact support.
                      </p>
                    </div>
                  ) : (
                    <Dropdown
                      placeholder="Select current country"
                      value={data.livingIn}
                      options={allCountryOptions}
                      onChange={(v) => updateData("livingIn", v)}
                      renderOption={renderCountryOption}
                      renderSelected={renderSelectedCountry}
                    />
                  )}
                  {errors.livingIn && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.livingIn}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Private Information */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Private Information
                  </h3>
                  <p className="text-sm text-gray-500">
                    Must match your government-issued ID
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="first-name"
                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 uppercase"
                    placeholder="AYUB"
                    value={data.firstName}
                    onChange={(e) => updateData("firstName", e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 uppercase"
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
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <FaBirthdayCake className="inline mr-2 text-brand-500" />
                    Birthday
                  </p>
                  <DatePicker
                    value={data.dateOfBirth}
                    onChange={(date) => updateData("dateOfBirth", date)}
                  />
                  {errors.dateOfBirth && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </p>
                  <div className="flex gap-3">
                    {["male", "female", "other"].map((g) => (
                      <label
                        key={g}
                        className={clsx(
                          "flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all",
                          data.gender === g
                            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 bg-white dark:bg-gray-800"
                        )}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={data.gender === g}
                          onChange={(e) => updateData("gender", e.target.value)}
                          className="sr-only"
                        />
                        <span
                          className={clsx(
                            "capitalize font-medium text-sm",
                            data.gender === g
                              ? "text-brand-600 dark:text-brand-400"
                              : "text-gray-700 dark:text-gray-300"
                          )}
                        >
                          {g}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.gender && (
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Language Skills */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FaLanguage className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Language Skills
                  </h3>
                  <p className="text-sm text-gray-500">
                    Languages you can teach
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <FaStar className="w-6 h-6 text-brand-500" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Native Language
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your mother tongue (you can teach this language)
                    </p>
                  </div>
                </div>
                {isLoadingLanguages ? (
                  <div className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center gap-2">
                    <Spinner />
                    <span className="text-gray-500">Loading languages...</span>
                  </div>
                ) : languageOptions.length === 0 ? (
                  <div className="w-full px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-xl">
                    <p className="text-yellow-600 text-sm">
                      No languages found. Please contact support.
                    </p>
                  </div>
                ) : (
                  <Dropdown
                    placeholder="Select your native language"
                    value={data.nativeLanguage}
                    options={languageOptions}
                    onChange={(v) => updateData("nativeLanguage", v)}
                    renderOption={renderLanguageOption}
                    renderSelected={renderLanguageOption}
                  />
                )}
                {languagesError && !isLoadingLanguages && (
                  <p className="text-xs text-gray-500 mt-2">
                    Using a fallback list due to a network issue.
                  </p>
                )}
                {errors.nativeLanguage && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.nativeLanguage}
                  </p>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-2 border-brand-200 dark:border-brand-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaChalkboardTeacher className="w-6 h-6 text-brand-600" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        Languages Taught <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add languages you want to teach (Native or C2 level
                        required)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={
                      isLoadingTeachableLanguages ||
                      !!teachableLanguagesError ||
                      teachableLanguageOptions.length === 0
                    }
                    onClick={() =>
                      updateData("otherLanguages", [
                        ...data.otherLanguages,
                        { language: "", level: "" },
                      ])
                    }
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-colors",
                      isLoadingTeachableLanguages ||
                        !!teachableLanguagesError ||
                        teachableLanguageOptions.length === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-brand-500 hover:bg-brand-600 text-white"
                    )}
                  >
                    <FaPlus className="w-3 h-3" /> Add Language
                  </button>
                </div>

                {isLoadingTeachableLanguages && (
                  <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                    <Spinner /> Loading available teaching languages...
                  </p>
                )}
                {teachableLanguagesError && !isLoadingTeachableLanguages && (
                  <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
                    <FiInfo className="w-4 h-4" />
                    Failed to load teaching languages. Please try again later.
                  </p>
                )}
                {!isLoadingTeachableLanguages &&
                  !teachableLanguagesError &&
                  teachableLanguageOptions.length === 0 && (
                    <p className="text-xs text-amber-600 mb-3 flex items-center gap-1">
                      <FiInfo className="w-4 h-4" />
                      No teaching languages are currently configured. Please
                      contact support.
                    </p>
                  )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Only <span className="font-semibold">Native</span> or{" "}
                      <span className="font-semibold">C2 (Proficient)</span>{" "}
                      level speakers can teach a language. Language availability
                      is limited - check spots before adding.
                    </p>
                  </div>
                </div>

                {errors.otherLanguages && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mb-4">
                    <FiInfo className="w-4 h-4" />
                    {errors.otherLanguages}
                  </p>
                )}

                {data.otherLanguages.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <FaGlobe className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No languages added yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click &quot;Add Language&quot; to add languages you want
                      to teach
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.otherLanguages.map((lang, index) => {
                      const isTeachableLevel =
                        lang.level === "native" || lang.level === "c2";
                      const langAvailability = teachableLanguages?.find(
                        (l) => l.name === lang.language
                      );
                      const isAvailable = langAvailability?.available ?? true;
                      const showAvailabilityWarning =
                        isTeachableLevel && lang.language && !isAvailable;

                      return (
                        <div
                          key={index}
                          className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 transition-colors ${
                            showAvailabilityWarning
                              ? "border-red-300 dark:border-red-700"
                              : isTeachableLevel && lang.language && isAvailable
                              ? "border-green-300 dark:border-green-700"
                              : "border-gray-100 dark:border-gray-600"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded-lg">
                                Language #{index + 1}
                              </span>
                              {isTeachableLevel &&
                                lang.language &&
                                isAvailable && (
                                  <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg flex items-center gap-1">
                                    <FiCheckCircle className="w-3 h-3" /> Can
                                    Teach
                                  </span>
                                )}
                              {showAvailabilityWarning && (
                                <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-lg">
                                  Not Available
                                </span>
                              )}
                            </div>
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
                              className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                            >
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                <FaLanguage className="text-brand-500" />{" "}
                                Language
                              </p>
                              <Dropdown
                                placeholder="Select language"
                                value={lang.language}
                                options={teachableLanguageOptions}
                                onChange={(value) => {
                                  const newLanguages = [...data.otherLanguages];
                                  newLanguages[index] = {
                                    ...lang,
                                    language: value,
                                  };
                                  updateData("otherLanguages", newLanguages);
                                }}
                                renderOption={renderTeachableLanguageOption}
                                renderSelected={renderTeachableLanguageOption}
                              />
                              {lang.language && langAvailability && (
                                <p
                                  className={`text-xs mt-1 ${
                                    isAvailable
                                      ? "text-green-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {isAvailable
                                    ? "Teaching spots currently available"
                                    : "No teaching spots available for this language"}
                                </p>
                              )}
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
                                  newLanguages[index] = {
                                    ...lang,
                                    level: value,
                                  };
                                  updateData("otherLanguages", newLanguages);
                                }}
                              />
                              {lang.level && !isTeachableLevel && (
                                <p className="text-xs text-amber-600 mt-1">
                                  Only Native or C2 level can teach this
                                  language
                                </p>
                              )}
                            </div>
                          </div>
                          {showAvailabilityWarning && (
                            <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <FiInfo className="w-4 h-4" />
                                {lang.language} teaching positions are currently
                                full. Please choose another language.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Photo */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                  <FaCamera className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Photo
                  </h3>
                  <p className="text-sm text-gray-500">
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
                      "w-40 h-40 mx-auto rounded-full border-4 overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center transition-all",
                      data.profilePhoto
                        ? "border-green-400 shadow-lg shadow-green-500/20"
                        : "border-gray-200 dark:border-gray-600"
                    )}
                  >
                    {data.profilePhoto ? (
                      <img
                        src={URL.createObjectURL(data.profilePhoto!)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-14 h-14 text-gray-300" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div
                    className={clsx(
                      "p-6 border-2 border-dashed rounded-2xl text-center transition-all",
                      data.profilePhoto
                        ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-brand-400"
                    )}
                  >
                    {data.profilePhoto ? (
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <FaCheckCircle className="w-7 h-7 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <FaUpload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {data.profilePhoto
                        ? "Photo Uploaded!"
                        : "Upload Your Photo"}
                    </p>
                    {data.profilePhoto && (
                      <p className="text-sm text-green-600 dark:text-green-400 truncate max-w-[200px] mx-auto">
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
                        "inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl font-semibold cursor-pointer transition-all",
                        data.profilePhoto
                          ? "bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300"
                          : "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl"
                      )}
                    >
                      <FaCamera className="w-4 h-4" />
                      {data.profilePhoto ? "Change Photo" : "Choose Photo"}
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <FaImage className="text-blue-500" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                        Photo Requirements
                      </span>
                    </div>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                      <li className="font-semibold text-blue-700 dark:text-blue-300">
                        Technical:
                      </li>
                      <li>• Minimum 250×250 pixels</li>
                      <li>• JPG, PNG, or BMP format</li>
                      <li>• Maximum 2MB</li>
                      <li className="font-semibold text-blue-700 dark:text-blue-300 mt-2">
                        Professional Standards:
                      </li>
                      <li>• Clear headshot with your face fully visible</li>
                      <li>• Professional attire recommended</li>
                      <li>• Neutral or simple background</li>
                      <li>• Good lighting, no filters or heavy editing</li>
                      <li>• Solo photo only (no group photos)</li>
                      <li>• Friendly and approachable expression</li>
                    </ul>
                  </div>
                </div>
              </div>

              {errors.profilePhoto && (
                <p className="text-red-500 text-sm mt-4">
                  {errors.profilePhoto}
                </p>
              )}

              <div
                className={clsx(
                  "rounded-xl border-2 p-4 mt-6 transition-all",
                  data.photoAgreement
                    ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                )}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.photoAgreement}
                    onChange={(e) =>
                      updateData("photoAgreement", e.target.checked)
                    }
                    className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I&apos;m aware that if my profile photo does not respect the
                    listed characteristics, my application could be rejected.
                  </span>
                </label>
              </div>
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
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white mb-3">
                <FiBriefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Teaching Experience
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Share your background and expertise
              </p>
            </div>

            {/* Teacher Bio */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Describe yourself as a teacher
                  </h3>
                  <p className="text-sm text-gray-500">
                    Write a short bio that highlights your teaching approach and
                    personality
                  </p>
                </div>
              </div>

              <label htmlFor="teacher-bio" className="sr-only">
                Teacher bio
              </label>
              <textarea
                id="teacher-bio"
                placeholder="Tell students what makes you unique as a teacher, your teaching philosophy, and how you help students achieve their goals..."
                value={data.teacherBio}
                onChange={(e) => updateData("teacherBio", e.target.value)}
                rows={4}
                maxLength={500}
                className={
                  "w-full px-4 py-2.5 bg-white dark:bg-gray-800 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-y " +
                  (data.teacherBio && data.teacherBio.trim().length < 50
                    ? "border-red-300"
                    : data.teacherBio.trim().length >= 50
                    ? "border-green-300"
                    : "border-gray-200 dark:border-gray-700")
                }
              />
              <div className="flex items-center justify-between">
                <p
                  className={
                    data.teacherBio && data.teacherBio.trim().length < 50
                      ? "text-xs text-red-500"
                      : "text-xs text-green-600"
                  }
                >
                  {data.teacherBio.trim().length < 50
                    ? `${Math.max(
                        0,
                        50 - data.teacherBio.trim().length
                      )} more characters needed`
                    : "✓ Bio looks good!"}
                </p>
                <p className="text-xs text-gray-400">
                  {data.teacherBio.length}/500
                </p>
              </div>
              {errors.teacherBio && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <FiInfo className="w-4 h-4" />
                  {errors.teacherBio}
                </p>
              )}
            </div>

            {/* Education Experience */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FaGraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Education
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add your educational background
                  </p>
                </div>
              </div>

              {/* Display existing entries as read-only cards */}
              {data.educationEntries.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Added Education:
                  </p>
                  {data.educationEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-lg">
                              Education #{index + 1}
                            </span>
                            <span className="text-sm text-gray-500">
                              {entry.fromYear} - {entry.toYear}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {entry.major}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {entry.degree} from {entry.institution}
                          </p>
                          {entry.description && (
                            <p className="text-sm text-gray-500">
                              {entry.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducationEntry(entry.id)}
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors ml-2"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Single form for adding new entry */}
              <EducationForm
                onAddEntry={(entry) => {
                  addEducationEntry(entry);
                }}
              />

              {errors.educationEntries && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                  <FiInfo className="w-4 h-4" />
                  {errors.educationEntries}
                </p>
              )}
            </div>

            {/* Teaching Experience */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FiBriefcase className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Teaching Experience
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add your teaching work history
                  </p>
                </div>
              </div>

              {/* Display existing entries as read-only cards */}
              {data.teachingExperienceEntries.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Added Experiences:
                  </p>
                  {data.teachingExperienceEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg">
                              Experience #{index + 1}
                            </span>
                            <span className="text-sm text-gray-500">
                              {entry.fromYear} - {entry.toYear}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {entry.position}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {entry.company}
                          </p>
                          {entry.description && (
                            <p className="text-sm text-gray-500">
                              {entry.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeTeachingExperienceEntry(entry.id)
                          }
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors ml-2"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Single form for adding new entry */}
              <TeachingExperienceForm
                onAddEntry={(entry) => {
                  addTeachingExperienceEntry(entry);
                }}
              />
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <FaCertificate className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Certifications
                  </h3>
                  <p className="text-sm text-gray-500">
                    Add your professional certificates and credentials
                  </p>
                </div>
              </div>

              {/* Display existing certificates as read-only cards */}
              {data.certifications.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Added Certificates:
                  </p>
                  {data.certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg">
                              Certificate #{index + 1}
                            </span>
                            {cert.yearIssued && (
                              <span className="text-sm text-gray-500">
                                Issued: {cert.yearIssued}
                                {cert.expiryYear && cert.expiryYear !== "never"
                                  ? ` - Expires: ${cert.expiryYear}`
                                  : " - Never expires"}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {cert.name}
                          </h4>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {cert.type}
                            </span>
                            {cert.institution && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {cert.institution}
                                </span>
                              </>
                            )}
                          </div>
                          {cert.description && (
                            <p className="text-sm text-gray-500 mb-2">
                              {cert.description}
                            </p>
                          )}
                          {cert.attachment && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <FaCertificate className="w-3 h-3" />
                              <span>{cert.attachment.name}</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            updateData(
                              "certifications",
                              data.certifications.filter((_, i) => i !== index)
                            );
                          }}
                          className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors ml-2"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Single form for adding new certificate */}
              <SpecialtyCertificateForm
                onAddEntry={(entry) => {
                  updateData("certifications", [...data.certifications, entry]);
                }}
              />

              {errors.certifications && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                  <FiInfo className="w-4 h-4" />
                  {errors.certifications}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-3">
                <FaStar className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Teaching Specialization
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Tell us about your teaching areas and expertise
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FaStar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Teaching Materials
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select the types of materials you use in your teaching
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {isLoadingTeachingMaterials ? (
                  <div className="col-span-3 flex items-center justify-center py-8">
                    <Spinner />
                    <span className="ml-2 text-gray-500">Loading materials...</span>
                  </div>
                ) : teachingMaterialsError ? (
                  <div className="col-span-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-xl p-4">
                    <p className="text-red-600 text-sm">
                      Failed to load teaching materials. Please refresh the page.
                    </p>
                  </div>
                ) : teachingMaterials && teachingMaterials.length > 0 ? (
                  teachingMaterials.map((material) => (
                    <label
                      key={material.value}
                      className={clsx(
                        "flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border-2",
                        data.specialties.includes(material.value)
                          ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                          data.specialties.includes(material.value)
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        {data.specialties.includes(material.value) && (
                          <FiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={data.specialties.includes(material.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateData("specialties", [
                              ...data.specialties,
                              material.value,
                            ]);
                          } else {
                            updateData(
                              "specialties",
                              data.specialties.filter((s) => s !== material.value)
                            );
                          }
                        }}
                        className="sr-only"
                      />
                      <span
                        className={clsx(
                          "text-sm font-medium",
                          data.specialties.includes(material.value)
                            ? "text-green-700 dark:text-green-400"
                            : "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {material.label}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="col-span-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded-xl p-4">
                    <p className="text-yellow-600 text-sm">
                      No teaching materials available.
                    </p>
                  </div>
                )}
              </div>
              {errors.specialties && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                  <FiInfo className="w-4 h-4" />
                  {errors.specialties}
                </p>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Teaching Specialist
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Select the areas that best describe your specialization
              </p>
              <div className="flex flex-wrap gap-2">
                {teachingStyles.map((style) => (
                  <label
                    key={style}
                    className={clsx(
                      "relative flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all",
                      data.teachingStyles.includes(style)
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-900/30"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                    )}
                  >
                    {data.teachingStyles.includes(style) && (
                      <FiCheck className="w-4 h-4 text-brand-500" />
                    )}
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={data.teachingStyles.includes(style)}
                      onChange={(e) =>
                        e.target.checked
                          ? updateData("teachingStyles", [
                              ...data.teachingStyles,
                              style,
                            ])
                          : updateData(
                              "teachingStyles",
                              data.teachingStyles.filter((s) => s !== style)
                            )
                      }
                    />
                    <span
                      className={clsx(
                        "text-sm font-medium",
                        data.teachingStyles.includes(style)
                          ? "text-brand-700 dark:text-brand-300"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white mb-3">
                <FiVideo className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Video Introduction
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Record a short video to introduce yourself
              </p>
            </div>

            {/* Tips Banner */}
            <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-semibold text-blue-800 dark:text-blue-200">
                  Tips:
                </span>{" "}
                Keep it 2-3 mins • Introduce yourself in Swahili & English •
                Good lighting • Show your personality!
              </div>
            </div>

            {/* About Me Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About Me Description
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tell students about yourself and your teaching approach
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <textarea
                  value={data.introText}
                  onChange={(e) =>
                    updateData("introText", e.target.value.slice(0, 1000))
                  }
                  placeholder="Introduce yourself to potential students. Share your background, teaching style, what makes you passionate about teaching, and what students can expect from your lessons..."
                  rows={6}
                  className={clsx(
                    "w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none transition-all resize-none",
                    data.introText && data.introText.trim().length >= 100
                      ? "border-green-300 dark:border-green-600 focus:border-green-400 dark:focus:border-green-500"
                      : data.introText && data.introText.trim().length > 0
                      ? "border-yellow-300 dark:border-yellow-600 focus:border-yellow-400 dark:focus:border-yellow-500"
                      : "border-gray-200 dark:border-gray-600 focus:border-brand-400 dark:focus:border-brand-500"
                  )}
                />

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {data.introText && data.introText.trim().length >= 100 ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Great length!</span>
                      </div>
                    ) : data.introText && data.introText.trim().length > 0 ? (
                      <div className="text-yellow-600 dark:text-yellow-400">
                        {100 - data.introText.trim().length} more characters
                        needed
                      </div>
                    ) : null}
                  </div>
                  <div className="text-gray-400">
                    {data.introText.length}/1000
                  </div>
                </div>

                {errors.introText && (
                  <p className="flex items-center gap-1 text-red-500 text-sm">
                    <FiInfo className="w-4 h-4" />
                    {errors.introText}
                  </p>
                )}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Example Video */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FaPlay className="w-4 h-4 text-purple-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Example Video
                  </h3>
                </div>
                <div className="rounded-xl overflow-hidden bg-black aspect-video relative">
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                    title="Example Tutor Introduction Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full absolute inset-0"
                  />
                </div>
                <p className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-3">
                  <FiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                  Great example of a clear, friendly intro
                </p>
              </div>

              {/* Upload Your Video */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FaUpload className="w-4 h-4 text-pink-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Your Video
                  </h3>
                </div>

                {data.videoFile ? (
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden bg-black aspect-video">
                      <video
                        controls
                        className="w-full h-full object-contain"
                        src={videoPreviewUrl || undefined}
                      >
                        <track kind="captions" />
                      </video>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-600 dark:text-green-400 truncate flex-1 mr-2">
                        ✓ {data.videoFile.name}
                      </p>
                      <label
                        htmlFor="intro-video"
                        className="text-sm text-brand-600 hover:text-brand-700 font-medium cursor-pointer"
                      >
                        Change
                      </label>
                    </div>
                  </div>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl aspect-video flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 hover:border-brand-400 transition-colors cursor-pointer"
                    onClick={() =>
                      document.getElementById("intro-video")?.click()
                    }
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                      <FaPlay className="w-5 h-5 text-gray-400 ml-0.5" />
                    </div>
                    <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                      Click to upload video
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      MP4, MOV, AVI  Max 500MB
                    </p>
                  </div>
                )}

                <input
                  id="intro-video"
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    updateData("videoFile", e.target.files?.[0] || null)
                  }
                  className="hidden"
                />

                {errors.videoFile && (
                  <p className="flex items-center gap-1 text-red-500 text-sm mt-3">
                    <FiInfo className="w-4 h-4" />
                    {errors.videoFile}
                  </p>
                )}
              </div>
            </div>

            {/* YouTube Publishing Consent */}
            <div
              className={clsx(
                "rounded-2xl border-2 p-6 transition-all",
                data.youtubePublishConsent
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-start gap-4">
                <input
                  id="youtube-consent"
                  type="checkbox"
                  checked={data.youtubePublishConsent}
                  onChange={(e) =>
                    updateData("youtubePublishConsent", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                />
                <label
                  htmlFor="youtube-consent"
                  className="flex-1 cursor-pointer"
                >
                  <div className="mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      YouTube Publishing Consent
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I agree to allow ZTalk to publish my introduction video on
                    YouTube for promotional and marketing purposes. This helps
                    attract more students to the platform.
                  </p>
                </label>
              </div>
            </div>

            {/* Webcam Confirmation */}
            <div
              className={clsx(
                "rounded-2xl border-2 p-6 transition-all",
                data.webcamConfirmation
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-start gap-4">
                <input
                  id="webcam-confirmation"
                  type="checkbox"
                  checked={data.webcamConfirmation}
                  onChange={(e) =>
                    updateData("webcamConfirmation", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                />
                <label
                  htmlFor="webcam-confirmation"
                  className="flex-1 cursor-pointer"
                >
                  <div className="mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Webcam Confirmation
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    I confirm that I have a working webcam that will be used for
                    teaching lessons on Zoom, Google Meet, etc. A webcam is
                    required for all live teaching sessions.
                  </p>
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="text-center pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white mb-3">
                <FaClipboardCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Review Your Application
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Please verify your information before submitting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-brand-600" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {data.firstName} {data.lastName}
                    </span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {data.email}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {data.from} → {data.livingIn}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Native: {data.nativeLanguage}
                  </p>
                  {data.otherLanguages.filter(
                    (l) => l.level === "native" || l.level === "c2"
                  ).length > 0 && (
                    <div className="text-gray-600 dark:text-gray-400">
                      <span>Teaching: </span>
                      {data.otherLanguages
                        .filter((l) => l.level === "native" || l.level === "c2")
                        .map((l, i) => (
                          <span
                            key={i}
                            className="font-medium text-brand-600 dark:text-brand-400"
                          >
                            {l.language}
                            {i <
                            data.otherLanguages.filter(
                              (x) => x.level === "native" || x.level === "c2"
                            ).length -
                              1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FaGraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Education
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  {data.educationEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {entry.degree}
                      </span>
                      <span className="text-gray-500"> at </span>
                      {entry.institution}
                    </div>
                  ))}
                </div>
              </div>

              {/* Teaching Experience */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <FiBriefcase className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Teaching Experience
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  {data.teachingExperienceEntries.map((entry, index) => (
                    <div
                      key={index}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {entry.position}
                      </span>
                      <span className="text-gray-500"> at </span>
                      {entry.company}
                      <span className="text-gray-500">
                        {" "}
                        ({entry.fromYear} - {entry.toYear || "Present"})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <FaCertificate className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Certifications
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  {data.certifications.map((file, index) => (
                    <p
                      key={index}
                      className="text-gray-600 dark:text-gray-400 truncate"
                    >
                      {file.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Teaching Specialties */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FaStar className="w-4 h-4 text-green-600" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Teaching Specialties
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-lg"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Teaching Styles */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FaChalkboardTeacher className="w-4 h-4 text-purple-600" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Teaching Styles
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.teachingStyles.map((style) => (
                  <span
                    key={style}
                    className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium rounded-lg"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            <div
              className={clsx(
                "rounded-2xl border-2 p-6 transition-all",
                data.agreedToTerms
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              )}
            >
              <div className="flex items-start gap-4">
                <input
                  id="agreed-to-terms"
                  type="checkbox"
                  checked={data.agreedToTerms}
                  onChange={(e) =>
                    updateData("agreedToTerms", e.target.checked)
                  }
                  className="mt-1 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 cursor-pointer"
                />
                <label
                  htmlFor="agreed-to-terms"
                  className="flex-1 cursor-pointer"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I agree to the{" "}
                    <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
                      Privacy Policy
                    </span>{" "}
                    for teachers on Ztalk
                  </span>
                </label>
              </div>
            </div>
            {errors.agreedToTerms && (
              <p className="flex items-center gap-1 text-red-500 text-sm">
                <FiInfo className="w-4 h-4" />
                {errors.agreedToTerms}
              </p>
            )}

            <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <FiInfo className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">
                  What happens next?
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  After submission, our team will review your application within
                  2-3 business days. You&apos;ll receive an email notification
                  with the result.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state while fetching draft
  if (isDraftLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading your application...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-brand-600 via-brand-500 to-blue-500 overflow-hidden">
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
        <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-4">
              <FiZap className="w-4 h-4" />
              Join 500+ Swahili Teachers
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Become a Ztalk Teacher
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Share your knowledge, set your own schedule, and earn money
              teaching Swahili to students worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Step Indicator - Desktop */}
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm -mt-8 relative z-10">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isCompleted = index < activeStep;
                const isCurrent = index === activeStep;

                return (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center relative">
                      <div
                        className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                          isCompleted
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                            : isCurrent
                            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/20"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                        )}
                      >
                        {isCompleted ? (
                          <FiCheck className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <p
                          className={clsx(
                            "text-sm font-semibold",
                            isCurrent
                              ? "text-brand-600 dark:text-brand-400"
                              : isCompleted
                              ? "text-green-600"
                              : "text-gray-500"
                          )}
                        >
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 hidden lg:block">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-1 mx-4 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={clsx(
                            "h-full rounded-full transition-all duration-500",
                            index < activeStep
                              ? "bg-green-500 w-full"
                              : "bg-gray-200 dark:bg-gray-600 w-0"
                          )}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm -mt-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const StepIcon = steps[activeStep].icon;
                  return (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center">
                      <StepIcon className="w-5 h-5" />
                    </div>
                  );
                })()}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {steps[activeStep].title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Step {activeStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-600">
                  {Math.round((activeStep / (steps.length - 1)) * 100)}%
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-brand-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-10 shadow-sm">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8">
            <button
              onClick={prevStep}
              disabled={activeStep === 0}
              className={clsx(
                "flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 w-full md:w-auto order-2 md:order-1",
                activeStep === 0
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              <FiChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="hidden md:flex items-center gap-2 order-1 md:order-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    index === activeStep
                      ? "w-8 bg-brand-500"
                      : index < activeStep
                      ? "bg-green-500"
                      : "bg-gray-200 dark:bg-gray-600"
                  )}
                />
              ))}
            </div>

            {activeStep === steps.length - 1 ? (
              <button
                onClick={submitApplication}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] transition-all duration-200 w-full md:w-auto order-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="md" color="white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-200 w-full md:w-auto order-3"
              >
                Continue
                <FiChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[10000] animate-fade-in">
          <div
            className={clsx(
              "flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg border-2 min-w-[300px]",
              toastMessage.type === "success" &&
                "bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200",
              toastMessage.type === "error" &&
                "bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200",
              toastMessage.type === "info" &&
                "bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200"
            )}
          >
            {toastMessage.type === "success" && (
              <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {toastMessage.type === "error" && (
              <FiInfo className="w-5 h-5 flex-shrink-0" />
            )}
            {toastMessage.type === "info" && (
              <FiInfo className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="font-medium text-sm">{toastMessage.message}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="ml-auto hover:opacity-70 transition-opacity"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
