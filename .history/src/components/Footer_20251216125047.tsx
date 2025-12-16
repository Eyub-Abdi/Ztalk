import { FiTwitter, FiGithub, FiLinkedin, FiSend } from "react-icons/fi";
import { FormEvent } from "react";

const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Offers", href: "#offers" },
  { label: "Tutors", href: "#featured-tutors" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const RESOURCE_LINKS: { label: string; href: string }[] = [
  { label: "Docs (Coming Soon)", href: "#" },
  { label: "Pricing", href: "#offers" },
  { label: "Accessibility", href: "#" },
  { label: "Status", href: "#" },
];

const COMPANY_LINKS: { label: string; href: string }[] = [
  { label: "About", href: "#offers" },
  { label: "Contact", href: "#contact" },
  { label: "Become a Teacher", href: "/become-teacher" },
  { label: "Careers", href: "#" },
  { label: "Legal", href: "#legal" },
];

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  // Render a disabled, non-navigable element for placeholder links
  if (href === "#") {
    return (
      <span
        role="link"
        aria-disabled="true"
        className="text-sm text-gray-400 cursor-not-allowed"
      >
        {children}
      </span>
    );
  }
  return (
    <a
      href={href}
      className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
    >
      {children}
    </a>
  );
}

export function Footer() {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Placeholder: integrate with real email service later
  }

  return (
    <footer id="footer" className="bg-white border-t border-gray-200 mt-20">
      <div className="container-main py-12 md:py-16">
        <div className="space-y-12 md:space-y-16">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 justify-between items-start">
            {/* Brand + newsletter */}
            <div className="flex flex-col items-start gap-6 md:basis-[30%]">
              <span className="text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">
                Ztalk
              </span>
              <p className="text-sm text-gray-500 max-w-sm">
                Build real Swahili communication confidence through
                human-guided, culturally respectful learning experiences.
              </p>
              <address
                id="contact"
                className="text-sm leading-snug text-gray-500 not-italic"
                aria-label="Company physical address"
              >
                <p>Thabit Kombo, 3rd Floor</p>
                <p>Zanzibar, Tanzania</p>
              </address>

              {/* Newsletter form */}
              <form onSubmit={handleSubmit} className="w-full">
                <label
                  htmlFor="newsletter-email"
                  className="block text-xs uppercase tracking-wider text-gray-500 mb-2"
                >
                  Stay in the loop
                </label>
                <div className="flex items-stretch gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    id="newsletter-email"
                    aria-label="Email address"
                    className="input text-sm flex-1"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm px-4 md:px-5 font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 transition-all"
                  >
                    <FiSend className="w-4 h-4" />
                    <span className="ml-1 hidden sm:inline">Subscribe</span>
                  </button>
                </div>
              </form>

              {/* Social links */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  aria-label="Twitter"
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand-500 transition-colors"
                >
                  <FiTwitter className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="GitHub"
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand-500 transition-colors"
                >
                  <FiGithub className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  aria-label="LinkedIn"
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-brand-500 transition-colors"
                >
                  <FiLinkedin className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Link columns */}
            <div className="flex flex-wrap gap-12 md:gap-16 flex-1">
              <div className="flex flex-col items-start gap-3 min-w-[130px]">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Navigate
                </span>
                {NAV_LINKS.map((l) => (
                  <FooterLink key={`${l.href}-${l.label}`} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
              <div className="flex flex-col items-start gap-3 min-w-[130px]">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Resources
                </span>
                {RESOURCE_LINKS.map((l) => (
                  <FooterLink key={`${l.href}-${l.label}`} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
              <div className="flex flex-col items-start gap-3 min-w-[130px]">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Company
                </span>
                {COMPANY_LINKS.map((l) => (
                  <FooterLink key={`${l.href}-${l.label}`} href={l.href}>
                    {l.label}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom legal */}
          <div className="space-y-4 text-xs" id="legal">
            <hr className="border-gray-200" />
            <p className="text-gray-500">
              © {new Date().getFullYear()} Ztalk. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-gray-500">
              <a
                href="/terms"
                className="hover:text-brand-500 transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-brand-500 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#cookies"
                className="hover:text-brand-500 transition-colors"
              >
                Cookies
              </a>
              <a
                href="#contact"
                className="hover:text-brand-500 transition-colors"
              >
                Contact
              </a>
            </div>
            <span className="sr-only">End of page</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
