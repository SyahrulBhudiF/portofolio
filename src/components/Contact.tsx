import { FileUser, Github, Linkedin, type LucideIcon, Mail } from "lucide-react";

const socialLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "mailto:syahrulbhudif@ryuko.my.id", label: "Email", icon: Mail },
  { href: "https://www.linkedin.com/in/syahrulbhudif/", label: "LinkedIn", icon: Linkedin },
  { href: "https://github.com/SyahrulBhudiF", label: "GitHub", icon: Github },
];

export default function Contact() {
  return (
    <div className="flex flex-col items-center gap-6">
      <a
        href="/assets/cv_syahrul.pdf"
        download="Syahrul_CV.pdf"
        className="mt-4 flex items-center gap-2 rounded-md bg-white px-6 py-2 text-black opacity-50 transition-transform duration-300 ease-in-out hover:-translate-y-1 max-sm:p-3 max-sm:text-sm"
      >
        Download CV
        <FileUser size={20} />
      </a>
      <div className="flex gap-6">
        {socialLinks.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="flex h-8 w-8 items-center justify-center rounded border-2 border-white text-white opacity-50 transition-transform duration-300 ease-in-out hover:-translate-y-1"
          >
            <Icon size={24} />
          </a>
        ))}
      </div>
    </div>
  );
}
