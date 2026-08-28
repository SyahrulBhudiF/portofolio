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
        <span aria-hidden="true" className="h-0.5 w-16 bg-[#652682]" />
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-mono text-xs text-purple-200/70">
          <span>Built with Astro, React &amp; Tailwind</span>
          {/* A 3px square rather than a middle dot: no glyph, so nothing to
              mis-encode, and it matches the pixel motif. */}
          <span aria-hidden="true" className="size-[3px] bg-purple-300/40 max-sm:hidden" />
          <span>
            Art by{" "}
            <a
              href="https://nacila.itch.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e09eff] underline decoration-[#c180df]/50 underline-offset-4 outline-none transition-colors duration-200 hover:text-white hover:decoration-white focus-visible:text-white focus-visible:decoration-white"
            >
              Nacila
            </a>
          </span>
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
            // .pixel-frame is the bare notched silhouette, so these stay a dark
            // face with a light outline instead of three more filled tags
            // competing with the CV button.
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="pixel-frame flex size-11 items-center justify-center border-2 border-[#c180df] bg-[#2a1236] text-[#dcb8f0] [--pixel-notch:4px] outline-none transition-[transform,background-color,color] duration-300 ease-in-out hover:-translate-y-1 hover:bg-[#652682] hover:text-white focus-visible:-translate-y-1 focus-visible:bg-[#652682] focus-visible:text-white"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
