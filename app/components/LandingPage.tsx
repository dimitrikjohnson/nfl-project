import React from "react";
import { Suspense } from "react";
import Link from 'next/link';
import LeagueLeaders from "@/app/components/LeagueLeaders";
import Standings from '@/app/components/Standings';
import Scoreboard from "@/app/components/Scoreboard";

export default function LandingPage() {
    return (
        <>
            <Scoreboard />
            <section className="w-full mt-28 md:mt-48 mb-40">
                <div className="hero">
                    <div className="hero-content text-center">
                        <div className="max-w-xl">
                            <h1 className="mb-8 md:mb-12 text-4xl md:text-5xl font-bold">Because stats don&apos;t have to be complicated</h1>
                            <div className="w-6/12 mx-auto mb-8 md:mb-12 border-b-2 border-cyan-400"></div>
                            <p className="mb-12">
                                Big Football is an NFL statistics website for casual football fans with a focus on minimalistic design. View dashboards 
                                with schedules, stats, rosters, and standings — all styled to match each team&apos;s identity.
                            </p>
                            <div className="flex justify-center relative">
                                <Link 
                                    href="/teams" 
                                    prefetch={ true } 
                                    className="btn h-10 min-h-10 mr-2.5 bg-cyan-400 hover:bg-cyan-300 text-backdrop-dark"
                                >
                                    Select a team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>       
            </section> 
            <section className="w-full m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                <LeagueLeaders />
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <Standings />
                </Suspense>
            </section>
        </>
    )
}