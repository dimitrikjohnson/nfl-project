import { Suspense } from "react";
import Link from 'next/link';
import LeagueLeaders from "@/app/components/LeagueLeaders";
import Standings from '@/app/components/Standings';
import Scoreboard from "@/app/components/Scoreboard";
import getAllTeams from "@/app/apiCalls/getAllTeams";
import getLandingBackground from "@/app/helpers/getLandingBackground";

export default async function LandingPage() {
    const teams = await getAllTeams();

    const background = await getLandingBackground();
    const { venueName, venueImage } = background;

    return (
        <> 
            <header className="relative bg-black dark:bg-transparent w-full h-fit mb-16 md:mb-24 overflow-hidden">
                <Scoreboard />
                <img
                    src={ venueImage }
                    alt={ venueName }
                    className="absolute inset-0 object-cover w-full h-full grayscale opacity-15 dark:opacity-10"
                />
                <section id="content" className="relative z-10 text-primary-dark flex flex-col items-start text-left md:items-center md:text-center px-4 max-w-2xl mt-24 mb-16 md:mt-36 md:mb-36 mx-auto">
                    <h1 className="font-protest uppercase mb-8 md:mb-10 text-4xl md:text-[53px] tracking-wide leading-[1.2] md:leading-[1.2]">
                        NFL stats,
                        <br />
                        No distractions.
                    </h1>
                    <div className="w-6/12 mb-8 md:mb-12 border-b-2 border-cyan-400"></div>
                    <p className="mb-10">
                        View NFL dashboards with schedules, stats, rosters, and standings — all styled to match each team&apos;s identity.
                    </p>
                    <Link 
                        href="/teams" 
                        prefetch={ true } 
                        className="btn h-10 min-h-10 border-none bg-cyan-400 hover:bg-cyan-300 text-backdrop-dark"
                    >
                        Select a team
                    </Link> 
                </section>
                <section className="group mb-8" aria-label="Scrolling list of NFL teams">
                    <div className="whitespace-nowrap animate-scroll-x-fast md:animate-scroll-x-slow flex gap-10 pause">
                        { [...teams, ...teams].map((team, index) =>
                            <Link 
                                key={ index }
                                href={ `/teams/${team.shortDisplayName.toLowerCase()}` }
                                className="btn bg-transparent hover:bg-transparent border-none shadow-none p-0 m-0"
                            >
                                <img  
                                    src={ team.logo } 
                                    alt={ `${team.displayName} logo` }
                                    className="w-8 hover:scale-150 transition ease-in-out" 
                                />
                            </Link>   
                        )}    
                    </div>    
                </section>                     
            </header> 
            <div className="w-full m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                <LeagueLeaders />
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <Standings />
                </Suspense>
            </div>
        </>
    )
}