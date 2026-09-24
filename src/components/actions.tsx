"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, Linkedin, Play, X } from "lucide-react";
import { site } from "@/config/site";
import { getShareUrl, getSource, videoSource, withSource } from "@/lib/links";

const Attribution = createContext<string | null>(null);
export function PageEnhancements({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    setSource(getSource(window.location.search, site.share.allowedSources));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll("[data-reveal]").forEach(node => {
      // Never hide content already visible before hydration.
      if (node.getBoundingClientRect().top > window.innerHeight) node.classList.add("will-reveal");
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);
  return <Attribution.Provider value={source}>{children}</Attribution.Provider>;
}
export function DonateButton({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const source = useContext(Attribution);
  return <a href={withSource(site.donationUrl, source)} target="_blank" rel="noopener noreferrer" className={`button button-primary ${className}`} data-donate>
    {compact ? site.labels.donateShort : site.labels.donate}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only"> ({site.labels.external})</span>
  </a>;
}
export function OfficialLink() {
  const source = useContext(Attribution);
  return <a className="text-link" href={withSource(site.donationUrl, source)} target="_blank" rel="noopener noreferrer">{site.footer.officialLink}<ArrowUpRight size={17} aria-hidden="true"/><span className="sr-only"> ({site.labels.external})</span></a>;
}
export function ShareButtons() {
  const source = useContext(Attribution);
  const [url, setUrl] = useState<string>(site.canonicalUrl || site.donationUrl);
  const [copied, setCopied] = useState(false);
  const [fallback, setFallback] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => { setUrl(getShareUrl(site.canonicalUrl, window.location.href, source)); }, [source]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url); setCopied(true); setFallback(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch { setFallback(true); }
  }
  const message = encodeURIComponent(`${site.share.message}\n\n${url}`);
  return <div>
    <div className="share-buttons">
      <button className="share-button" onClick={copy}>{copied ? <Check size={19}/> : <Copy size={19}/>}<span aria-live="polite">{copied ? site.share.copied : site.share.copy}</span></button>
      <a className="share-button" href={`mailto:?subject=${encodeURIComponent(site.share.emailSubject)}&body=${message}`}><Mail size={19}/>{site.share.email}</a>
      <a className="share-button" href={`sms:?body=${message}`}><MessageCircle size={19}/>{site.share.text}</a>
      <a className="share-button" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer"><Linkedin size={19}/>{site.share.linkedin}<span className="sr-only"> ({site.labels.external})</span></a>
    </div>
    {fallback && <label className="copy-fallback">{site.share.copyFallback}<input aria-label={site.share.copyFallback} readOnly value={url} onFocus={e => e.target.select()} autoFocus /></label>}
  </div>;
}
export function VideoPlayer() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const source = videoSource(site.video.url);
  useEffect(() => {
    if (open) dialog.current?.showModal(); else dialog.current?.close();
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = original; };
  }, [open]);
  return <>
    <button className="video-cover" onClick={() => setOpen(true)} aria-label={source ? site.video.play : site.video.comingSoon}>
      <img src={site.video.poster.src} alt={site.video.poster.alt} loading="lazy" width="966" height="720" style={{objectPosition: site.video.poster.position}} />
      <span className="video-shade" />
      <span className="play-icon"><Play fill="currentColor" size={24} aria-hidden="true"/></span>
      <span className="video-caption"><strong>{source ? site.video.play : site.video.comingSoon}</strong><span>{site.video.duration}</span></span>
    </button>
    <dialog ref={dialog} className="video-dialog" aria-label={site.video.play} onCancel={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }} onClose={() => setOpen(false)}>
      <div className="video-dialog-content">
        <button className="close-button" onClick={() => setOpen(false)} aria-label={site.video.close}><X/></button>
        {open && (source?.type === "file" ? <video src={source.url} poster={site.video.poster.src} controls autoPlay playsInline /> : source?.type === "embed" ? <iframe title={site.video.play} src={source.url} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen /> : source ? <a href={source.url} className="button button-primary" target="_blank" rel="noopener noreferrer">{site.video.fallback}<ArrowUpRight size={18}/></a> : <div className="video-empty"><Play size={40}/><h3>{site.video.comingSoon}</h3><p>{site.video.placeholderNote}</p></div>)}
      </div>
    </dialog>
  </>;
}
