import { Geist, Geist_Mono, Azeret_Mono, Lekton } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const azeretMono = Azeret_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"]
});

export const lekton = Lekton({
  weight: ["400", "700"],
  subsets: ["latin"]
});