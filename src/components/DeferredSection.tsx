"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type DeferredSectionProps = {
  children: ReactNode;
  placeholderClassName: string;
  rootMargin?: string;
};

export default function DeferredSection({
  children,
  placeholderClassName,
  rootMargin = "450px 0px",
}: DeferredSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || shouldRender) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} className="w-full">
      {shouldRender ? children : <div aria-hidden="true" className={placeholderClassName} />}
    </div>
  );
}
