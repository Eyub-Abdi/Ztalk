import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  useCompleteRegistration,
  CompleteRegistrationPayload,
} from "../features/auth/useAuthApi";
import { useAuth } from "../features/auth/AuthProvider";
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiLoader,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiGlobe,
  FiShield,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import clsx from "clsx";

// Country interface matching REST Countries API
interface Country {
  code: string;
  name: string;
  flagCode: string;
  region: string;
  flagUrl: string;
  callingCode: string;
}

// Enhanced auto-detect country using timezone with better accuracy
function detectCountry(): string {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneToCountry: Record<string, string> = {
      // East Africa
      "Africa/Dar_es_Salaam": "TZ",
      "Africa/Nairobi": "KE",
      "Africa/Kampala": "UG",
      "Africa/Kigali": "RW",
      "Africa/Addis_Ababa": "ET",
      "Africa/Mogadishu": "ET",
      "Africa/Asmara": "ET",
      // West Africa
      "Africa/Lagos": "NG",
      "Africa/Accra": "GH",
      "Africa/Abidjan": "GH",
      "Africa/Dakar": "NG",
      // Southern Africa
      "Africa/Johannesburg": "ZA",
      "Africa/Maputo": "ZA",
      "Africa/Harare": "ZA",
      "Africa/Lusaka": "ZA",
      // United States (all major timezones)
      "America/New_York": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "America/Los_Angeles": "US",
      "America/Phoenix": "US",
      "America/Anchorage": "US",
      "Pacific/Honolulu": "US",
      "America/Detroit": "US",
      "America/Indianapolis": "US",
      // Canada
      "America/Toronto": "CA",
      "America/Vancouver": "CA",
      "America/Montreal": "CA",
      "America/Edmonton": "CA",
      "America/Winnipeg": "CA",
      "America/Halifax": "CA",
      // Mexico
      "America/Mexico_City": "MX",
      "America/Tijuana": "MX",
      "America/Monterrey": "MX",
      // Europe
      "Europe/London": "GB",
      "Europe/Berlin": "DE",
      "Europe/Paris": "FR",
      "Europe/Madrid": "ES",
      "Europe/Rome": "IT",
      "Europe/Amsterdam": "NL",
      "Europe/Brussels": "NL",
      // Asia
      "Asia/Kolkata": "IN",
      "Asia/Mumbai": "IN",
      "Asia/Delhi": "IN",
      "Asia/Shanghai": "CN",
      "Asia/Hong_Kong": "CN",
      "Asia/Beijing": "CN",
      "Asia/Tokyo": "JP",
      "Asia/Seoul": "KR",
      "Asia/Singapore": "SG",
      "Asia/Manila": "PH",
      // Oceania
      "Australia/Sydney": "AU",
      "Australia/Melbourne": "AU",
      "Australia/Brisbane": "AU",
      "Australia/Perth": "AU",
      "Pacific/Auckland": "NZ",
      // South America
      "America/Sao_Paulo": "BR",
      "America/Rio_Branco": "BR",
      "America/Buenos_Aires": "AR",
      // Middle East
      "Asia/Dubai": "AE",
      "Asia/Riyadh": "SA",
    };
    return timezoneToCountry[timezone] || "";
  } catch {
    return "";
  }
}

// Password Requirement Component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  if (met) return null; // Only show unmet requirements
  
  return (
    <div className="flex items-center gap-2 text-xs text-red-600">
      <FiX className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{text}</span>
    </div>
  );
}

export default function CompleteRegistration() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const registerMutation = useCompleteRegistration();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [form, setForm] = useState<CompleteRegistrationPayload>({
    verification_token: token || "",
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    country: "",
    preferred_language: "en",
  });

  useEffect(() => {
    if (token) {
      setForm((prev) => ({ ...prev, verification_token: token }));
    }
  }, [token]);

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,region,flags,idd"
        );
        const data = await response.json();

        const formattedCountries: Country[] = data
          .map((country: any) => ({
            code: country.cca2,
            name: country.name.common,
            flagCode: country.cca2.toLowerCase(),
            region: country.region || "Other",
            flagUrl: country.flags.png,
            callingCode: country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : "",
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
        setLoadingCountries(false);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Auto-detect country on mount (after countries are loaded)
  useEffect(() => {
    if (countries.length > 0) {
      const detectedCountry = detectCountry();
      if (detectedCountry) {
        setForm((prev) => ({ ...prev, country: detectedCountry }));
      }
    }
  }, [countries]);

  // Filter countries based on search
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      newErrors.username = "Only letters, numbers, and underscores";
    }

    if (!form.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!form.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const password = form.password;
      const passwordErrors: string[] = [];

      // Length check
      if (password.length < 8) {
        passwordErrors.push("At least 8 characters");
      }

      // Character variety checks
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push("One uppercase letter");
      }

      if (!/[a-z]/.test(password)) {
        passwordErrors.push("One lowercase letter");
      }

      if (!/\d/.test(password)) {
        passwordErrors.push("One number");
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        passwordErrors.push("One special character");
      }

      // Check for repeated characters (3+ times)
      if (/(.)\1{2,}/.test(password)) {
        passwordErrors.push("Cannot contain repeated characters");
      }

      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors.join(", ");
      }
    }

    if (!form.password_confirm) {
      newErrors.password_confirm = "Please confirm your password";
    } else if (form.password !== form.password_confirm) {
      newErrors.password_confirm = "Passwords don't match";
    }

    if (!form.country) {
      newErrors.country = "Please select your country";
    }

    // Phone number validation (optional but must be valid if provided)
    if (form.phone_number.trim()) {
      // Remove all non-digit characters for validation
      const digitsOnly = form.phone_number.replace(/\D/g, "");

      if (digitsOnly.length < 7) {
        newErrors.phone_number = "Phone number is too short";
      } else if (digitsOnly.length > 15) {
        newErrors.phone_number = "Phone number is too long";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) return;

    try {
      const result = await registerMutation.mutateAsync(form);
      setAuth(result.user, result.access, result.refresh);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Special handling for phone number - only allow numbers and common phone characters
    if (name === "phone_number") {
      // Allow only digits, spaces, dashes, parentheses, and plus sign
      const sanitized = value.replace(/[^\d\s\-\(\)\+]/g, "");
      setForm((prev) => ({ ...prev, [name]: sanitized }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-gray-600 mb-6">
            This registration link is invalid or has expired.
          </p>
          <Link to="/" className="text-brand-600 hover:underline font-medium">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-brand-600">Ztalk</span>
          </Link>
        </div>

        {/* Success Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-green-200 text-green-700 rounded-full text-sm font-medium shadow-sm">
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
              <FiCheck className="w-3 h-3" />
            </div>
            Email verified successfully
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Complete your profile
          </h1>
          <p className="text-gray-600 text-lg">
            Just a few more details to get started
          </p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
                <p className="text-sm text-gray-500">Your login credentials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={clsx("input", errors.username && "input-error")}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className={clsx(
                        "input pr-10",
                        errors.password && "input-error"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* Password Requirements - Only show unmet */}
                  {form.password && (() => {
                    const requirements = [
                      { met: form.password.length >= 8, text: "At least 8 characters long" },
                      { met: /[A-Z]/.test(form.password), text: "At least 1 uppercase letter (A-Z)" },
                      { met: /[a-z]/.test(form.password), text: "At least 1 lowercase letter (a-z)" },
                      { met: /\d/.test(form.password), text: "At least 1 number (0-9)" },
                      { met: /[!@#$%^&*(),.?":{}|<>]/.test(form.password), text: "At least 1 special character (!@#$%^&*(),.?\":{}|<>)" },
                      { met: !/(.)\1{2,}/.test(form.password), text: "No repeated characters (like aaaa)" },
                    ];
                    
                    const unmet = requirements.filter(req => !req.met);
                    if (unmet.length === 0) return null;

                    return (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-medium text-red-700 mb-2">Password must have:</p>
                        <div className="space-y-1">
                          {unmet.map((req, idx) => (
                            <PasswordRequirement key={idx} met={req.met} text={req.text} />
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  
                  {errors.password && !form.password && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password_confirm"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.password_confirm}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={clsx(
                        "input pr-10",
                        errors.password_confirm && "input-error"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="w-4 h-4" />
                      ) : (
                        <FiEye className="w-4 h-4" />
                      )}
                    </button>
                    {form.password_confirm &&
                      form.password === form.password_confirm && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-green-600" />
                          </div>
                        </div>
                      )}
                  </div>
                  {errors.password_confirm && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.password_confirm}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FiMail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-500">Tell us about yourself</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="John"
                    className={clsx(
                      "input",
                      errors.first_name && "input-error"
                    )}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.first_name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={clsx("input", errors.last_name && "input-error")}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3 h-3" />
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone_number"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Phone Number{" "}
                  <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <div className="relative">
                  {form.country && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <img
                        src={
                          countries.find((c) => c.code === form.country)
                            ?.flagUrl
                        }
                        alt=""
                        className="w-5 h-4 rounded object-cover"
                      />
                      <span className="text-sm text-gray-600">
                        {countries.find((c) => c.code === form.country)
                          ?.callingCode || "+1"}
                      </span>
                    </div>
                  )}
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={form.phone_number}
                    onChange={handleChange}
                    maxLength={12}
                    placeholder={
                      form.country ? "123 456 7890" : "+1 (555) 123-4567"
                    }
                    className={clsx(
                      "input",
                      form.country && "pl-24",
                      errors.phone_number && "input-error"
                    )}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <FiAlertCircle className="w-3 h-3" />
                    {errors.phone_number}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Location Card */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <FiGlobe className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Location
                </h2>
                <p className="text-sm text-gray-500">Where are you located?</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>

              {/* Search Input with Selected Flag */}
              <div className="relative mb-4">
                {form.country && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                    <img
                      src={
                        countries.find((c) => c.code === form.country)?.flagUrl
                      }
                      alt=""
                      className="w-6 h-[18px] rounded object-cover"
                    />
                    <span className="text-sm text-gray-900 font-medium">
                      {countries.find((c) => c.code === form.country)?.name}
                    </span>
                  </div>
                )}
                <input
                  type="text"
                  placeholder={form.country ? "" : "Search your country..."}
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className={clsx(
                    "input",
                    form.country ? "pl-32 pr-10" : "pr-3"
                  )}
                />
                {form.country && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, country: "" }));
                      setCountrySearch("");
                      setErrors((prev) => ({ ...prev, country: "" }));
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Flag Grid */}
              {loadingCountries ? (
                <div className="flex items-center justify-center py-12">
                  <FiLoader className="w-6 h-6 text-brand-500 animate-spin" />
                  <span className="ml-2 text-sm text-gray-500">
                    Loading countries...
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 max-h-64 overflow-y-auto p-2">
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, country: country.code }));
                        setErrors((prev) => ({ ...prev, country: "" }));
                        setCountrySearch("");
                      }}
                      title={country.name}
                      className={clsx(
                        "relative flex flex-col items-center justify-center p-1.5 rounded-lg transition-all border-2",
                        form.country === country.code
                          ? "border-brand-500 bg-brand-50 shadow-md scale-105"
                          : "border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm hover:scale-105"
                      )}
                    >
                      <img
                        src={country.flagUrl}
                        alt={country.name}
                        className="w-6 h-[18px] rounded object-cover mb-0.5"
                      />
                      <span className="text-[9px] text-center font-medium text-gray-700 leading-tight">
                        {country.name.split(" ")[0]}
                      </span>
                      {form.country === country.code && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                          <FiCheck className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!loadingCountries && filteredCountries.length === 0 && (
                <p className="text-center text-gray-400 py-8 text-sm">
                  No countries found
                </p>
              )}

              {errors.country && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" />
                  {errors.country}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full sm:flex-1 btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  Creating your account...
                </>
              ) : (
                <>
                  <FiShield className="w-5 h-5" />
                  Create My Account
                </>
              )}
            </button>
          </div>

          {/* Terms */}
          <p className="text-center text-sm text-gray-500 leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link
              to="/terms"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
