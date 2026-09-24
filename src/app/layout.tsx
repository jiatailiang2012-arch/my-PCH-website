import type { Metadata } from "next";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.metadata.title,
  description: site.metadata.description,
  ...(site.canonicalUrl ? { metadataBase: new URL(site.canonicalUrl), alternates: { canonical: "/" } } : {}),
  openGraph: { title: site.metadata.title, description: site.metadata.description, type: "website", locale: "en_US" },
  twitter: { card: "summary", title: site.metadata.title, description: site.metadata.description },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
