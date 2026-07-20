import { useEffect, useState } from "react";

// Returns true when the viewport is below the mobile breakpoint (768px),
// matching the site-wide convention used for the Hero and card layouts.
// SSR-safe: defaults to false, then syncs on mount.
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 0.02}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}
