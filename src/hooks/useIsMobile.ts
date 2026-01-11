import { useCallback, useEffect, useState } from "react";

/**
 * Debounce function to limit the rate of function calls
 */
function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Custom hook to detect if the current viewport is mobile-sized.
 * - SSR-safe: Returns false on server, then updates on client mount
 * - Debounced: Resize events are debounced to improve performance
 *
 * @param breakpoint - The max width in pixels to consider as mobile (default: 768)
 * @param debounceMs - Debounce delay in milliseconds (default: 150)
 * @returns boolean indicating if viewport is mobile-sized
 */
export function useIsMobile(breakpoint = 768, debounceMs = 150): boolean {
  // SSR-safe: Initialize with false, will be updated on mount
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    // Ensure we're on the client
    if (typeof window === "undefined") {
      return;
    }

    // Check on mount to handle SSR hydration
    checkMobile();

    // Create debounced resize handler
    const debouncedCheckMobile = debounce(checkMobile, debounceMs);

    // Add event listener for resize
    window.addEventListener("resize", debouncedCheckMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", debouncedCheckMobile);
    };
  }, [breakpoint, debounceMs, checkMobile]);

  return isMobile;
}

export default useIsMobile;
