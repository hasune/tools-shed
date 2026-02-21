"use client";

import { useEffect, useRef } from "react";

interface GiscusCommentsProps {
  term: string; // usually the tool slug or page path
}

export default function GiscusComments({ term }: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "hasune/tools-shed");
    script.setAttribute("data-repo-id", "R_kgDORVbF2Q");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDORVbF2c4C262O");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, [term]);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold text-white mb-6">Comments & Feedback</h2>
      <div ref={ref} className="giscus-container" />
      <p className="text-gray-500 text-xs mt-4">
        Comments are powered by{" "}
        <a
          href="https://giscus.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Giscus
        </a>
        . Sign in with GitHub to leave a comment.
      </p>
    </div>
  );
}
