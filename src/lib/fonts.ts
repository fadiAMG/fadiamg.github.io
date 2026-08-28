import { Bricolage_Grotesque, Familjen_Grotesk, Martian_Mono } from "next/font/google";

export const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  display: "swap",
});

export const mono = Martian_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "500"],
  display: "swap",
});

export const body = Familjen_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});
