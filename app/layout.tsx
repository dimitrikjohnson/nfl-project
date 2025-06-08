import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";

import SuperBowlWinnerProvider from "./contextProviders/sbWinnerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home | Big Football",
  description: "Big Football is an NFL statistics website for casual football fans with a focus on minimalistic design. View dashboards with schedules, stats, rosters, and standings — all styled to match each team's identity.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <SuperBowlWinnerProvider>
          {children}
        </SuperBowlWinnerProvider>
      </body>
    </html>
  );
}
