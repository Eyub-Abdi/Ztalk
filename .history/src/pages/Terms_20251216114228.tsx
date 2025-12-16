import { FiCheckCircle } from "react-icons/fi";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-600">Last updated: September 13, 2025</p>
        <p className="text-gray-600">
          These Terms of Service (&quot;Terms&quot;) govern your access to and
          use of the Ztalk platform (the &quot;Service&quot;). By accessing or
          using the Service you agree to be bound by these Terms.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">1. Eligibility</h2>
        <p className="text-gray-600">
          You must be at least 13 years old (or the minimum legal age in your
          jurisdiction) to use the Service. If you are under the age of
          majority, you represent that you have your parent or legal
          guardian&apos;s permission.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">2. Accounts</h2>
        <p className="text-gray-600">
          You are responsible for safeguarding your account credentials. You
          must promptly notify us of any unauthorized use. We may suspend or
          terminate your account if we suspect misuse.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">3. Acceptable Use</h2>
        <p className="text-gray-600">
          You agree not to misuse the Service or help anyone else do so.
          Prohibited conduct includes (a) infringing intellectual property
          rights, (b) attempting to probe, scan, or test vulnerabilities of the
          Service, (c) interfering with other users&apos; access, and (d) using
          the Service for fraudulent, abusive, or illegal activities.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          4. Tutor & Learner Interactions
        </h2>
        <p className="text-gray-600">
          All scheduling, messaging, and lesson activities must remain
          on-platform. Off-platform solicitation that circumvents platform
          safeguards is prohibited.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          5. Payments & Cancellations
        </h2>
        <p className="text-gray-600">
          Lesson purchases, refunds, and cancellation windows will be described
          at checkout or in future pricing documentation. Where applicable, you
          authorize us (or our payment processor) to charge stored payment
          methods.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          6. Intellectual Property
        </h2>
        <p className="text-gray-600">
          All platform code, design, logos, and original learning content are
          owned by Ztalk or its licensors. Users retain ownership of original
          uploads but grant us a limited license to host and display that
          content to deliver the Service.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">7. Content Standards</h2>
        <p className="text-gray-600">
          You agree that any content you submit (profiles, messages, materials)
          will be accurate, respectful, culturally sensitive, and lawful. We may
          remove content that violates these Terms.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">8. Disclaimers</h2>
        <p className="text-gray-600">
          The Service is provided on an &quot;AS IS&quot; and &quot;AS
          AVAILABLE&quot; basis without warranties of any kind, express or
          implied. We disclaim all implied warranties of merchantability,
          fitness for a particular purpose, and non-infringement.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">
          9. Limitation of Liability
        </h2>
        <p className="text-gray-600">
          To the maximum extent permitted by law, Ztalk shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages,
          or any loss of profits or revenues.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">10. Termination</h2>
        <p className="text-gray-600">
          We may suspend or terminate your access at any time if you violate
          these Terms. Upon termination, sections intended to survive (including
          IP, disclaimers, and limitations) remain in effect.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">11. Changes to Terms</h2>
        <p className="text-gray-600">
          We may modify these Terms. Material changes will be indicated by
          updating the &quot;Last updated&quot; date. Continued use after
          changes constitutes acceptance.
        </p>

        <h2 className="text-lg font-semibold text-gray-900">12. Contact</h2>
        <p className="text-gray-600">
          Questions about these Terms can be sent once our support channel is
          live. For now, please reference the address below.
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
