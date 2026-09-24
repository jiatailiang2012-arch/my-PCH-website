"use client";

import { useEffect, useRef } from "react";
import { site } from "@/config/site";

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const player = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (player && !reducedMotion.matches && !connection?.saveData) {
      void player.play().catch(() => { /* Keep the poster and native play button if autoplay is blocked. */ });
    }
    const handleMotionChange = () => { if (reducedMotion.matches) player?.pause(); };
    reducedMotion.addEventListener("change", handleMotionChange);
    return () => { reducedMotion.removeEventListener("change", handleMotionChange); player?.pause(); };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        className="hero-video"
        poster={site.hero.video.poster}
        aria-label={site.hero.video.label}
        width={1280}
        height={720}
        muted
        playsInline
        controls
        preload="metadata"
      >
        <source src={site.hero.video.mobileSrc} media="(max-width: 767px)" type="video/mp4" />
        <source src={site.hero.video.src} type="video/mp4" />
        <a href={site.hero.video.src}>{site.hero.video.fallback}</a>
      </video>
    </>
  );
}
