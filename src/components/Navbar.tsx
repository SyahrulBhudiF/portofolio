import { useEffect, useId, useRef, useState } from "react";

interface Props {
  projectPage: boolean;
}

const links = [
  {
    id: "home",
    label: "Home",
    path: "M4 10V20H10V14H14V20H20V10M2 10H4V8H6V6H8V4H16V6H18V8H20V10H22",
  },
  {
    id: "about",
    label: "About",
    path: "M8 3H16V5H18V11H16V13H8V11H6V5H8V3ZM6 16H18V18H20V22H4V18H6V16Z",
  },
  {
    id: "experience",
    label: "Experience",
    path: "M8 6V2H16V6M3 6H21V20H3V6ZM3 12H10V15H14V12H21",
  },
  {
    id: "open-source",
    label: "Open Source",
    path: "M8 6H6V8H4V10H2V14H4V16H6V18H8M16 6H18V8H20V10H22V14H20V16H18V18H16M14 4V8H12V16H10V20",
  },
  {
    id: "projects",
    label: "Projects",
    path: "M2 5H10V7H22V20H2V5ZM2 11H22",
  },
];

export default function Navbar({ projectPage }: Props) {
  const [activeId, setActiveId] = useState(projectPage ? "projects" : "home");
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open]);

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((section) => section !== null);

    if (sections.length === 0) return;

    const observeSections = () => {
      const observer = new IntersectionObserver(
        () => {
          let currentId = "home";
          for (const section of sections) {
            if (section.getBoundingClientRect().top <= window.innerHeight * 0.4) {
              currentId = section.id;
            }
          }
          setActiveId(currentId);
        },
        {
          rootMargin: `-${window.innerHeight * 0.3}px 0px -${window.innerHeight * 0.6}px 0px`,
          threshold: 0,
        },
      );

      for (const section of sections) observer.observe(section);
      return observer;
    };

    let observer = observeSections();
    const resize = () => {
      observer.disconnect();
      observer = observeSections();
    };
    window.addEventListener("resize", resize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <nav ref={navRef} className="site-menu" aria-label="Main navigation" data-open={open}>
      <button
        ref={toggleRef}
        type="button"
        className="pixel-frame site-menu-toggle"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
      >
        <svg className="site-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d={open ? "M6 6L18 18M18 6L6 18" : "M4 6H20M4 12H20M4 18H20"} />
        </svg>
        <span>{open ? "Close" : "Menu"}</span>
      </button>
      <div id={menuId} className="pixel-frame site-menu-frame">
        <ul className="site-menu-list">
          {links.map(({ id, label, path }) => (
            <li key={id}>
              <a
                href={`/#${id}`}
                className="site-menu-link"
                aria-current={activeId === id ? "location" : undefined}
                onClick={() => {
                  if (open) {
                    setOpen(false);
                    toggleRef.current?.focus();
                  }
                }}
              >
                <svg className="site-menu-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={path} />
                </svg>
                <span className="site-menu-label">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
