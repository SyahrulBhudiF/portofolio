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
    <div className="flex flex-col items-center gap-2">
      <div>
        <p className="font-mono text-[0.625rem] tracking-[0.18em] text-purple-300/50 uppercase max-sm:text-[0.5625rem]">
          Built with Astro React Tailwind
        </p>
      </div>
      <div className="flex flex-col items-center gap-6">
        <a
          href="/assets/cv_syahrul.pdf"
          download="Syahrul_CV.pdf"
          className="pixel-tag mt-4 flex items-center gap-2 px-6 py-2.5 text-base text-white outline-none transition-transform duration-300 ease-in-out hover:-translate-y-1 focus-visible:-translate-y-1 max-sm:px-5 max-sm:py-2 max-sm:text-sm"
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
              rel={
                href.startsWith("mailto:") ? undefined : "noopener noreferrer"
              }
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
