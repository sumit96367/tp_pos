import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import "maplibre-gl/dist/maplibre-gl.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Tandoori Pizza | A little heat, a lot of heart.",
  description: "Find your nearest Tandoori Pizza. Est. 2015, California.",
  openGraph: { 
    title: "Tandoori Pizza", 
    description: "A little heat, a lot of heart.", 
    type: "website" 
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { 
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable}`}>
      <body className="font-sans bg-cream text-navy antialiased">
        {children}
      </body>
    </html>
  ); 
}
