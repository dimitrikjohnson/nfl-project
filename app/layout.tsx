import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.css";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from "@fortawesome/free-brands-svg-icons";
 
import SuperBowlWinnerProvider from "./contextProviders/sbWinnerProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Big Football',
    default: 'Big Football', // a default is required when creating a template
  },
  description: "Big Football is an NFL statistics website for casual football fans. View dashboards with schedules, stats, rosters, and standings — all styled to match each team's identity.",
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={`bg-gray-200 text-primary dark:bg-backdrop-dark dark:text-primary-dark min-h-screen ${inter.className}`}>
                <SuperBowlWinnerProvider>
                    {children}
                </SuperBowlWinnerProvider>
                <footer className="font-rubik footer md:footer-horizontal justify-items-center justify-between gap-x-10 mt-28 py-12 px-4 md:px-11 border-t border-gray-500 dark:border-lighterSecondaryGrey bg-[#D0D6E1] text-primary dark:bg-[#1C253B] dark:text-primary-dark">
                    <Link 
                        href={ '/' } 
                        className="flex gap-2 items-center text-xl"
                    >
                        <FontAwesomeIcon icon={faFootball} rotation={90} className="" />
                        <p className="font-protest tracking-wide uppercase">Big Football</p>
                    </Link>
                    <p className="flex h-full items-center text-center">
                        <span>
                            All data is courtesy of ESPN&apos;s NFL API. A list of many of the available endpoints has been curated by <a 
                                href="https://gist.github.com/nntrn/ee26cb2a0716de0947a0a4e9a157bc1c#scoreboard-api" 
                                target="_blank"
                                className="text-blue-800 dark:text-cyan-400 hover:underline"
                            >
                                @nntrn on GitHub
                            </a>.  
                        </span>
                    </p> 
                    <a 
                        href="https://github.com/dimitrikjohnson/nfl-project" 
                        className="flex items-center gap-2 group hover:text-blue-800 dark:hover:text-cyan-400" 
                        target="_blank"
                        title="Big Football GitHub repository"
                    >
                        <FontAwesomeIcon icon={faGithub} className="text-3xl" />
                        <span className="group-hover:underline">View on GitHub</span>
                    </a>
                </footer>
            </body>
        </html>
    );
}
