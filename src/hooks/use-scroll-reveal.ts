import { RefObject, useEffect } from "react";

import usePrefersReducedMotion from "./use-prefers-reduced-motion";

export type ScrollRevealOptions = IntersectionObserverInit & {
  once?: boolean;
};

/**
 * Adds a scroll reveal effect to any descendants that include the `data-animate` attribute.
 */
export const useScrollReveal = (
  containerRef: RefObject<HTMLElement>,
  { threshold = 0.2, rootMargin = "0px 0px -10% 0px", once = true, root }: ScrollRevealOptions = {}
) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const animatedElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-animate]:not([data-animate="static"])')
    );

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            if (once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { root, rootMargin, threshold }
    );

    animatedElements.forEach((element) => {
      if (!element.style.getPropertyValue("--stagger-delay")) {
        element.style.setProperty("--stagger-delay", "0ms");
      }

      element.classList.add("will-animate");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      animatedElements.forEach((element) => {
        element.classList.remove("will-animate", "is-visible");
      });
    };
  }, [containerRef, once, prefersReducedMotion, root, rootMargin, threshold]);
};

export default useScrollReveal;
