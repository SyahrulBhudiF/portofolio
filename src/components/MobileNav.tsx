import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export interface NavLink {
  href: string;
  label: string;
}

interface Props {
  links: NavLink[];
}

/** "/#open-source" -> "open-source" */
const sectionId = (href: string) => href.split("#")[1] ?? "";

export default function MobileNav({ links }: Props) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => sectionId(links[0]?.href ?? ""));

  // One observer for every section rather than one per link: the inline bar can
  // afford a hook per item because each item owns its own highlight, but here a
  // single active id drives the whole list.
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(sectionId(link.href)))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { threshold: 0.1, rootMargin: "-25% 0px -25% 0px" },
    );

    for (const section of sections) observer.observe(section);

    return () => observer.disconnect();
  }, [links]);

  return (
    // Bottom right, where a thumb already is: closed it is a 24px handle that
    // overlaps nothing, and the panel slides out of it rather than sitting
    // across the content the way the bottom bar did.
    <div className="fixed right-0 bottom-6 z-30 sm:hidden">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex h-11 w-6 items-center justify-center border-2 border-r-0 border-[#c180df] bg-[#2a1236] text-[#dcb8f0] outline-none transition-colors duration-200 hover:bg-[#652682] hover:text-white focus-visible:bg-[#652682] focus-visible:text-white"
          >
            {open ? (
              <ChevronRight size={14} aria-hidden="true" />
            ) : (
              <ChevronLeft size={14} aria-hidden="true" />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="left"
          align="end"
          sideOffset={0}
          className="w-36 border-2 border-[#c180df] bg-[#2a1236] p-1 data-[state=closed]:slide-out-to-right-4 data-[state=open]:slide-in-from-right-4"
        >
          <ul className="flex flex-col">
            {links.map((link) => {
              const isActive = sectionId(link.href) === activeId;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`block px-2.5 py-2 font-mono text-xs outline-none transition-colors duration-200 ${
                      isActive
                        ? "bg-[#652682] text-white"
                        : "text-purple-100 hover:bg-[#3e1d4d] focus-visible:bg-[#3e1d4d]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
}
