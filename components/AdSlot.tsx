"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  slot: string;
  format?: "auto" | "rectangle" | "leaderboard" | "skyscraper";
  className?: string;
}

// Publisher ID
const PUBLISHER_ID = "ca-pub-6229200956587599";

export default function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle) {
        ((window as Window & { adsbygoogle?: unknown[] }).adsbygoogle = (window as Window & { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
      }
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
