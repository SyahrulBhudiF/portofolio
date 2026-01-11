/**
 * Shared animation variants for Framer Motion
 * Centralized animation configurations for consistency across components
 */

/**
 * Fade up animation variant
 * Used for elements that fade in while moving up
 */
export const createFadeUpVariants = (isMobile: boolean) => ({
  hidden: {
    opacity: 0,
    y: isMobile ? 20 : 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: isMobile ? 0.5 : 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
});

/**
 * Card animation variant
 * Used for project cards and similar card components
 */
export const createCardVariants = (isMobile: boolean) => ({
  hidden: {
    opacity: 0,
    y: isMobile ? 20 : 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: isMobile ? 0.6 : 0.8,
      ease: [0.16, 1, 0.3, 1], // Clean easeOutExpo
      opacity: { duration: isMobile ? 0.4 : 0.6 },
      scale: {
        duration: isMobile ? 0.5 : 0.7,
        ease: [0.25, 0.1, 0.25, 1], // No bounce, pure smooth
      },
    },
  },
});

/**
 * Stagger children animation
 * Used for animating list items with delay
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger item animation
 * Used with staggerContainer for individual items
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * Scale on hover animation
 * Used for interactive elements
 */
export const scaleOnHover = {
  scale: 1.05,
  transition: { duration: 0.2 },
};

/**
 * Collapse/Expand animation
 * Used for collapsible sections
 */
export const collapseVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

/**
 * Rotate animation for chevron icons
 */
export const createRotateVariants = (isOpen: boolean) => ({
  animate: {
    rotate: isOpen ? 180 : 0,
  },
  transition: {
    duration: 0.3,
  },
});
