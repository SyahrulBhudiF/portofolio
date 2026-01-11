import { FileUser, Github, Linkedin, type LucideIcon, Mail } from "lucide-react";
import type React from "react";

interface SocialLink {
  href: string;
  title: string;
  ariaLabel: string;
  icon: LucideIcon;
  emailUser?: string;
  emailDomain?: string;
}

const social: SocialLink[] = [
  {
    href: "",
    title: "email",
    ariaLabel: "email",
    icon: Mail,
    emailUser: "syahrulbhudif",
    emailDomain: "ryuko.my.id",
  },
  {
    href: "https://www.linkedin.com/in/syahrulbhudif/",
    title: "linkedIn",
    ariaLabel: "linkedIn",
    icon: Linkedin,
  },
  {
    href: "https://github.com/SyahrulBhudiF",
    title: "github",
    ariaLabel: "github",
    icon: Github,
  },
  {
    href: "",
    title: "cv",
    ariaLabel: "cv",
    icon: FileUser,
  },
];

const Contact: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <a
        href="assets/cv_syahrul.pdf"
        download="Syahrul_CV.pdf"
        className="mt-4 px-6 py-2 max-sm:p-3 max-sm:text-sm bg-white opacity-50 text-black rounded-md flex gap-2 items-center transition-transform duration-300 ease-in-out hover:-translate-y-1"
      >
        Download CV
        <FileUser size={20} />
      </a>
      <div className="flex gap-6">
        {social.map(
          (item) =>
            item.title !== "cv" && (
              <a
                key={item.title}
                href={
                  item.title === "email"
                    ? `mailto:${item.emailUser}@${item.emailDomain}`
                    : item.href
                }
                target={item.title === "email" ? "_self" : "_blank"}
                rel={item.title === "email" ? "" : "noopener noreferrer"}
                aria-label={item.ariaLabel}
                className="flex items-center justify-center w-8 h-8 border-2 border-white opacity-50 rounded text-white transition-transform duration-300 ease-in-out hover:-translate-y-1"
              >
                <item.icon size={24} className="group-hover:border-purple-700" />
              </a>
            ),
        )}
      </div>
    </div>
  );
};

export default Contact;
