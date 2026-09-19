import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
export const metadata: Metadata = {
  title: "Tandoori Pizza | Find Our Locations",
  description: "Explore Tandoori Pizza locations across the United States.",
  openGraph: { title: "Tandoori Pizza | Find Our Locations", description: "Explore Tandoori Pizza locations across the United States.", type: "website" }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
