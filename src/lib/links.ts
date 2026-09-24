/** Attribution is carried in URLs only; this site does not collect analytics. */
export function getSource(search: string, allowed: readonly string[]): string | null {
  const source = new URLSearchParams(search).get("source");
  return source && allowed.includes(source) ? source : null;
}
export function withSource(base: string, source: string | null): string {
  const url = new URL(base);
  if (source) url.searchParams.set("source", source);
  return url.toString();
}
export function getShareUrl(canonical: string, current: string, source: string | null): string {
  const url = new URL(canonical || current);
  url.hash = "";
  url.search = "";
  return withSource(url.toString(), source);
}
export function getProgress(current: number | null, goal: number) {
  if (current === null || !Number.isFinite(current) || !Number.isFinite(goal) || goal <= 0) return null;
  return Math.min(100, Math.max(0, current / goal * 100));
}
export function videoSource(value: string): { type: "file" | "embed" | "link"; url: string } | null {
  if (!value) return null;
  if (/^\/(?!\/)/.test(value)) return { type: "file", url: value };
  let url: URL;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "https:") return null;
  if (/\.(mp4|webm)(\?|$)/i.test(value)) return { type: "file", url: value };
  const host = url.hostname.replace(/^www\./, "");
  if (["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(host)) {
    const id = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").pop();
    if (id && /^[\w-]{11}$/.test(id)) return { type: "embed", url: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1` };
    return null;
  }
  if (["vimeo.com", "player.vimeo.com"].includes(host)) {
    const id = url.pathname.split("/").pop();
    if (id && /^\d+$/.test(id)) return { type: "embed", url: `https://player.vimeo.com/video/${id}?autoplay=1` };
    return null;
  }
  return { type: "link", url: value };
}
