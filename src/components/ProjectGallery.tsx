import Magnetic from "@/components/ui/Magnetic";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { type CSSProperties, type FC, useCallback, useEffect, useRef, useState } from "react";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface Props {
  images: GalleryImage[];
}

// Inline, because components.css is unlayered and would beat a Tailwind
// arbitrary property. cqw resolves against the thumbnail's own grid cell, so
// the frame thins out with the image instead of staying at the cover's 14px.
const THUMB_FRAME = {
  "--band": "clamp(4px, 2cqw, 10px)",
  "--drop": "clamp(5px, 2.2cqw, 11px)",
} as CSSProperties;

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  images: GalleryImage[];
  reduceMotion: ReturnType<typeof useReducedMotion>;
}

// The selection belongs to the item that opened the dialog. That keeps the
// static gallery grid outside the state update when opening or paging images.
const GalleryItem: FC<GalleryItemProps> = ({ image, index, images, reduceMotion }) => {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = openAt !== null;
  const active = openAt === null ? null : images[openAt];

  const step = useCallback(
    (delta: number) =>
      setOpenAt((current) =>
        current === null ? current : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  // showModal() puts the dialog in the top layer, which brings a real focus
  // trap, Escape handling, and an inert background — none of which a div with
  // role="dialog" would have given us.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Scroll locking is still ours; the top layer does not stop the page behind.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <motion.li
      className="@container"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: (index % 2) * 0.06 }}
    >
      <button
        type="button"
        onClick={() => setOpenAt(index)}
        className="block w-full cursor-zoom-in text-left outline-none"
      >
        <Magnetic className="block">
          <span className="pixel-photo block" style={THUMB_FRAME}>
            <img src={image.src} alt={image.alt} loading="lazy" className="block w-full" />
          </span>
        </Magnetic>
        {image.caption && (
          <span className="mt-2 block font-mono text-xs tracking-[0.12em] text-purple-200/80 uppercase">
            {image.caption}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        className="m-0 h-full max-h-screen w-full max-w-screen overflow-hidden border-0 bg-transparent p-0 text-inherit backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        aria-label="Project gallery"
        onClose={() => setOpenAt(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        // A click on the backdrop targets the dialog itself, so this dismisses
        // on backdrop clicks without swallowing clicks on the content.
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpenAt(null);
        }}
      >
        {active && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
            <div className="absolute top-5 right-5">
              <button
                type="button"
                onClick={() => setOpenAt(null)}
                className="pixel-tag flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs text-white"
              >
                <X size={14} aria-hidden />
                Close
              </button>
            </div>

            <motion.figure
              key={active.src}
              className="flex max-h-full min-h-0 flex-col items-center gap-3"
              initial={reduceMotion ? false : { scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <span className="pixel-photo block min-h-0">
                <img
                  src={active.src}
                  alt={active.alt}
                  className="block max-h-[70vh] w-auto max-w-full object-contain"
                />
              </span>
              <figcaption className="text-center font-mono text-xs tracking-[0.12em] text-purple-200/80 uppercase">
                {active.caption ?? active.alt}
                <span className="ml-3 text-purple-300/50">
                  {openAt + 1}/{images.length}
                </span>
              </figcaption>
            </motion.figure>

            {images.length > 1 && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="pixel-tag flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs text-white"
                >
                  <ChevronLeft size={14} aria-hidden />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="pixel-tag flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs text-white"
                >
                  Next
                  <ChevronRight size={14} aria-hidden />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </motion.li>
  );
};

const ProjectGallery: FC<Props> = ({ images }) => {
  const reduceMotion = useReducedMotion();

  if (images.length === 0) return null;

  return (
    <ul className="grid grid-cols-2 gap-4 sm:gap-6">
      {images.map((image, index) => (
        <GalleryItem
          key={image.src}
          image={image}
          index={index}
          images={images}
          reduceMotion={reduceMotion}
        />
      ))}
    </ul>
  );
};

export default ProjectGallery;
