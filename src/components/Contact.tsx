import { FileUser, Mail } from "lucide-react";
import { type BrandIcon, GithubIcon, LinkedinIcon } from "./BrandIcons";

const socialLinks: { href: string; label: string; icon: BrandIcon }[] = [
  { href: "mailto:syahrulbhudif@ryuko.my.id", label: "Email", icon: Mail },
  {
    href: "https://www.linkedin.com/in/syahrulbhudif/",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
  {
    href: "https://github.com/SyahrulBhudiF",
    label: "GitHub",
    icon: GithubIcon,
  },
];

export default function Contact() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Was 10px uppercase at 50% opacity with 0.18em tracking — three
          legibility penalties stacked on the same line. Sentence case at 12px
          reads; the rule above it makes this a deliberate colophon rather than
          fine print that drifted into the middle of the block. */}
      <div className="flex flex-col items-center gap-3">
        <span aria-hidden="true" className="h-0.5 w-16 bg-accent-muted" />
        <p className="text-center font-mono text-xs text-purple-200/70">
          Built with Astro, React &amp; Tailwind
        </p>
        {/* The art credit gets its own line and a marker-style highlight behind
            the name, so the artist reads as a feature rather than fine print. */}
        <p className="flex items-baseline gap-2 font-mono text-sm text-purple-200/85">
          Art by
          <a
            href="https://nacila.itch.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[linear-gradient(transparent_45%,var(--accent-muted)_45%)] px-1 font-['VT323'] text-3xl leading-none tracking-[0.08em] text-accent-bright uppercase outline-none transition-colors duration-200 hover:text-white focus-visible:text-white"
          >
            Nacila
          </a>
        </p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <a
          href="/assets/cv_syahrul.pdf"
          download="Syahrul_CV.pdf"
          className="pixel-tag flex items-center gap-2 px-6 py-2.5 text-base text-white outline-none transition-transform duration-300 ease-in-out hover:-translate-y-1 focus-visible:-translate-y-1 max-sm:px-5 max-sm:py-2 max-sm:text-sm"
        >
          Download CV
          <FileUser size={18} />
        </a>
        <div className="flex gap-5">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="pixel-frame flex size-11 items-center justify-center text-accent-soft outline-none transition-[transform,color] duration-300 ease-in-out hover:-translate-y-1 focus-visible:-translate-y-1"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
