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
  FaPlay,
  FaClipboardCheck,
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
  FiLoader,
  FiShield,
  FiAward,
  FiZap,
  FiCalendar,
} from "react-icons/fi";
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
  educationEntries: EducationEntry[];
  certifications: File[];
  specialties: string[];
  teachingStyle: string;
  videoFile: File | null;
  introText: string;
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
  educationEntries: [],
  certifications: [],
  specialties: [],
  teachingStyle: "",
  videoFile: null,
  introText: "",
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
        className={clsx(
          "w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all duration-200",
          open
            ? "border-brand-500 ring-4 ring-brand-500/20"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        )}
      >
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
        <FaChevronDown
          className={clsx(
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-60 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
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
          ))}
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
      onChange(dateStr);
    }
  }, [selectedDay, selectedMonth, selectedYear, onChange]);

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

// Education Modal Component
function EducationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: EducationEntry) => void;
  initialData?: EducationEntry;
}) {
  const [fromYear, setFromYear] = useState(initialData?.fromYear || "");
  const [toYear, setToYear] = useState(initialData?.toYear || "");
  const [institution, setInstitution] = useState(
    initialData?.institution || ""
  );
  const [major, setMajor] = useState(initialData?.major || "");
  const [degree, setDegree] = useState(initialData?.degree || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [degreeDropdownOpen, setDegreeDropdownOpen] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const degreeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setFromDropdownOpen(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setToDropdownOpen(false);
      }
      if (
        degreeRef.current &&
        !degreeRef.current.contains(event.target as Node)
      ) {
        setDegreeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (!fromYear || !institution || !major || !degree) return;

    onSubmit({
      id: initialData?.id || Date.now().toString(),
      fromYear,
      toYear: toYear || "Present",
      institution,
      major,
      degree,
      description,
    });

    // Reset form
    setFromYear("");
    setToYear("");
    setInstitution("");
    setMajor("");
    setDegree("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Add education experience
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* From / To / Institution Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* From Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <div ref={fromRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setFromDropdownOpen(!fromDropdownOpen);
                    setToDropdownOpen(false);
                    setDegreeDropdownOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all",
                    fromDropdownOpen
                      ? "border-brand-500 ring-4 ring-brand-500/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <span
                    className={
                      fromYear
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400"
                    }
                  >
                    {fromYear || "Please Select"}
                  </span>
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 text-gray-400 transition-transform",
                      fromDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {fromDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
                    {educationYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setFromYear(year);
                          setFromDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                          year === fromYear
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

            {/* To Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <div ref={toRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setToDropdownOpen(!toDropdownOpen);
                    setFromDropdownOpen(false);
                    setDegreeDropdownOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all",
                    toDropdownOpen
                      ? "border-brand-500 ring-4 ring-brand-500/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <span
                    className={
                      toYear ? "text-gray-900 dark:text-white" : "text-gray-400"
                    }
                  >
                    {toYear || "Please Select"}
                  </span>
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 text-gray-400 transition-transform",
                      toDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {toDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setToYear("Present");
                        setToDropdownOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg",
                        toYear === "Present"
                          ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                    >
                      Present
                    </button>
                    {educationYears.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setToYear(year);
                          setToDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors last:rounded-b-lg",
                          year === toYear
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

            {/* Institution */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                placeholder="University name"
              />
            </div>
          </div>

          {/* Major / Degree Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Major */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Major / Topic
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                placeholder="e.g., Swahili Studies"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Degree
              </label>
              <div ref={degreeRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDegreeDropdownOpen(!degreeDropdownOpen);
                    setFromDropdownOpen(false);
                    setToDropdownOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 rounded-xl text-left transition-all",
                    degreeDropdownOpen
                      ? "border-brand-500 ring-4 ring-brand-500/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  )}
                >
                  <span
                    className={
                      degree
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400"
                    }
                  >
                    {degree
                      ? degreeOptions.find((d) => d.value === degree)?.label
                      : "Please select an option"}
                  </span>
                  <FaChevronDown
                    className={clsx(
                      "w-3 h-3 text-gray-400 transition-transform",
                      degreeDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                {degreeDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full max-h-48 overflow-auto bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-xl shadow-xl">
                    {degreeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setDegree(opt.value);
                          setDegreeDropdownOpen(false);
                        }}
                        className={clsx(
                          "w-full px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg",
                          opt.value === degree
                            ? "bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
              placeholder="Describe the focus of your studies."
            />
            <p className="text-right text-sm text-gray-400 mt-1">
              {description.length}/500
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!fromYear || !institution || !major || !degree}
            className={clsx(
              "w-full py-3.5 rounded-xl font-semibold text-white transition-all",
              fromYear && institution && major && degree
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
                : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
            )}
          >
            SUBMIT
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherApplication() {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<TeacherApplicationData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
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
      | EducationEntry[]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

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
                          {platform === "Ztalk Classroom" && (
                            <span className="px-2 py-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-semibold rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        {platform === "zoom" &&
                          data.videoPlayform === "zoom" && (
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
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                    <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                      <FiInfo className="w-4 h-4" />
                      {errors.from}
                    </p>
                  )}
                </div>
                <div>
                  <p className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                    Languages you can teach in
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

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaComments className="w-6 h-6 text-green-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Additional Languages
                      </h4>
                      <p className="text-sm text-gray-500">
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
                    className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-medium text-sm transition-colors"
                  >
                    <FaPlus className="w-3 h-3" /> Add
                  </button>
                </div>

                {data.otherLanguages.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-600">
                    <FaGlobe className="w-10 h-10 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      No additional languages yet
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click &quot;Add&quot; to add more languages
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {data.otherLanguages.map((lang, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-100 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-semibold rounded-lg">
                            Language #{index + 1}
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
                            className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                          >
                            <FaTimes className="w-4 h-4" />
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
                      "w-40 h-40 mx-auto rounded-2xl border-4 overflow-hidden bg-white dark:bg-gray-800 flex items-center justify-center transition-all",
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

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <label
                htmlFor="teaching-experience"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Describe your teaching experience
              </label>
              <textarea
                id="teaching-experience"
                rows={4}
                className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 resize-none"
                placeholder="Years of experience, age groups taught, teaching environments..."
                value={data.teachingExperience}
                onChange={(e) =>
                  updateData("teachingExperience", e.target.value)
                }
              />
              {errors.teachingExperience && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                  <FiInfo className="w-4 h-4" />
                  {errors.teachingExperience}
                </p>
              )}
            </div>

            {/* Education Experience */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
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
                <button
                  type="button"
                  onClick={() => setShowEducationModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-500/25"
                >
                  <FaPlus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {data.educationEntries.length > 0 ? (
                <div className="space-y-3">
                  {data.educationEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaGraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {entry.major} -{" "}
                            {
                              degreeOptions.find((d) => d.value === entry.degree)
                                ?.label
                            }
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.institution}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {entry.fromYear} - {entry.toYear}
                          </p>
                          {entry.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(entry.id)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaGraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No education added yet</p>
                  <p className="text-sm">
                    Click &quot;Add&quot; to add your educational background
                  </p>
                </div>
              )}
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
                    Upload teaching certificates (optional)
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-800 text-center">
                <input
                  id="certifications"
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={(e) =>
                    updateData(
                      "certifications",
                      Array.from(e.target.files || [])
                    )
                  }
                  className="hidden"
                />
                <label htmlFor="certifications" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                    <FaUpload className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    Upload Certificates
                  </p>
                  <p className="text-sm text-gray-500 mt-1">PDF files only</p>
                </label>
              </div>

              {data.certifications.length > 0 && (
                <div className="space-y-2">
                  {data.certifications.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <FaCertificate className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                          {file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          updateData(
                            "certifications",
                            data.certifications.filter((_, i) => i !== index)
                          )
                        }
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"
                      >
                        <FaTimes className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <FaStar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Teaching Specialties
                  </h3>
                  <p className="text-sm text-gray-500">
                    Select all areas you&apos;re comfortable teaching
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.map((specialty) => (
                  <label
                    key={specialty}
                    className={clsx(
                      "flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border-2",
                      data.specialties.includes(specialty)
                        ? "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                    )}
                  >
                    <div
                      className={clsx(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                        data.specialties.includes(specialty)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 dark:border-gray-600"
                      )}
                    >
                      {data.specialties.includes(specialty) && (
                        <FiCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
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
                      className="sr-only"
                    />
                    <span
                      className={clsx(
                        "text-sm font-medium",
                        data.specialties.includes(specialty)
                          ? "text-green-700 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
              {errors.specialties && (
                <p className="flex items-center gap-1 text-red-500 text-sm mt-2">
                  <FiInfo className="w-4 h-4" />
                  {errors.specialties}
                </p>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-5">
              <label
                htmlFor="teaching-style"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Teaching Style
              </label>
              <textarea
                id="teaching-style"
                rows={3}
                className="w-full px-4 py-3.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 resize-none"
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
                        src={URL.createObjectURL(data.videoFile)}
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
                      MP4, MOV, AVI • Max 100MB
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
          </div>
        );

      case 4:
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
                </div>
              </div>

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
                  <p className="text-gray-600 dark:text-gray-400">
                    {data.teachingExperience}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Education: {data.education}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FaStar className="w-4 h-4 text-purple-600" />
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Teaching Specialties
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-sm font-medium rounded-lg"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <label
              className={clsx(
                "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all border-2",
                data.agreedToTerms
                  ? "bg-green-50 dark:bg-green-900/20 border-green-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300"
              )}
            >
              <div
                className={clsx(
                  "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5",
                  data.agreedToTerms
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 dark:border-gray-600"
                )}
              >
                {data.agreedToTerms && (
                  <FiCheck className="w-4 h-4 text-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={data.agreedToTerms}
                onChange={(e) => updateData("agreedToTerms", e.target.checked)}
                className="sr-only"
              />
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
                    <FiLoader className="w-5 h-5 animate-spin" />
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
    </div>
  );
}
