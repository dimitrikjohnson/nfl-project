import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";

import CurrentSeasonProvider from "./contextProviders/currentSeasonProvider";
import SuperBowlWinnerProvider from "./contextProviders/sbWinnerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Process - NFL Stats",
  description: "The Process is...",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <CurrentSeasonProvider>
          <SuperBowlWinnerProvider>
            {children}
          </SuperBowlWinnerProvider>
        </CurrentSeasonProvider>
      </body>
    </html>
  );
}
