import { FiCheckCircle } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-600">Last updated: September 13, 2025</p>
        <p className="text-gray-600">
          This Privacy Policy describes how we collect, use, and safeguard
          personal information when you use the Ztalk platform. We are committed
          to respecting user privacy and applying data minimization principles.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          1. Information We Plan to Collect
        </h2>
        <p className="text-gray-600">
          Account basics (name, email, password hash), learning preferences,
          time zone, and limited usage analytics to improve tutor matching and
          lesson relevance.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          2. Future Optional Data
        </h2>
        <p className="text-gray-600">
          Profile photo, spoken languages, proficiency level, and lesson goals
          may be optionally provided to improve experience quality.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Usage Data</h2>
        <p className="text-gray-600">
          We may log feature interactions (e.g., search usage, lesson booking
          steps) to guide UX improvements. We will avoid invasive tracking and
          will not sell personal data.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          4. Cookies & Local Storage
        </h2>
        <p className="text-gray-600">
          Authentication tokens and minimal preference flags (e.g., theme) may
          be stored locally. No third-party advertising cookies will be used in
          early versions.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">5. Data Security</h2>
        <p className="text-gray-600">
          We intend to apply industry practices including salted password
          hashing, TLS encryption, role-based access controls, and periodic
          dependency patching.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">6. Data Retention</h2>
        <p className="text-gray-600">
          We will retain user data only as long as needed to provide the Service
          or comply with legal obligations. Inactive accounts may be archived or
          anonymized after a defined period.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">7. User Controls</h2>
        <p className="text-gray-600">
          Users may request account deletion or correction of inaccurate profile
          information when account management tooling is released.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">8. Third Parties</h2>
        <p className="text-gray-600">
          If we integrate video, payment, or messaging infrastructure, limited
          data may be shared with those processors strictly to deliver the
          Service. Each vendor will be reviewed for security posture.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          9. International Use
        </h2>
        <p className="text-gray-600">
          As we operate from Zanzibar, Tanzania, data may be processed locally
          or in other regions depending on infrastructure providers.
          Cross-border safeguards will be applied where required.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          10. Changes to This Policy
        </h2>
        <p className="text-gray-600">
          We may update this Policy. Material changes will update the date
          above. Continued use after changes signifies acceptance.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">11. Contact</h2>
        <p className="text-gray-600">
          Questions about privacy can be referenced to the address below until
          formal support channels are active.
        </p>

        <div className="pt-4 text-sm text-gray-600">
          <h3 className="text-base font-semibold text-gray-900 mb-2">Address</h3>
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-brand-600" />
              Thabit Kombo, 3rd Floor
            </li>
            <li className="flex items-center gap-2">
              <FiCheckCircle className="text-brand-600" />
              Zanzibar, Tanzania
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
