import React from "react";
import { Suspense } from "react";
import Link from 'next/link';
//import Image from 'next/image';
//import Leaders from './Leaders';
import LeagueLeaders from "@/app/components/LeagueLeaders";
import Standings from './Standings';
import Scoreboard from "./Scoreboard";
//import landing_design from '@/public/landing_design.svg';

export default function LandingPage() {
    return (
        <>
            {/*<section className="w-full mb-10 px-4 md:px-6 lg:px-14">*/}
            <Scoreboard />
            <section className="w-full mt-28 md:mt-48 mb-40">
                {/*<Image className="absolute right-0 h-screen w-full object-cover z-0" src={ landing_design }  alt="Background polka dot design" priority />
                <div className="w-full flex items-center h-screen">
                    <div>
                        <h1 className="relative mb-2 font-rubik text-6xl md:text-8xl">
                            <span className="block text-cyan-400">Because stats shouldn't be complicated</span>
                        </h1>
                        <p className="mb-2">
                            The Process is an NFL statistics website for casual football fans with a focus on minimalistic design. Find only the most important 
                            stats for every team to gain the insight that you need.
                        </p>
                        <div className="flex relative">
                            <Link href="/teams" prefetch={ true } className="btn h-10 min-h-10 mr-2.5 bg-cyan-400 text-[#1c232b]">Select a team</Link>
                            <button className="btn h-10 min-h-10 border border-cyan-400 text-cyan-400 bg-transparent">View league stats</button>
                        </div>    
                    </div>
                    <div>image</div>
                </div> */}
                <div className="hero">
                    <div className="hero-content text-center">
                        <div className="max-w-xl">
                            <h1 className="mb-8 md:mb-12 text-4xl md:text-5xl font-bold">Because stats don&apos;t have to be complicated</h1>
                            <div className="w-6/12 mx-auto mb-8 md:mb-12 border-b-2 border-cyan-400"></div>
                            <p className="mb-12">
                                Big Football is an NFL statistics website for casual football fans with a focus on minimalistic design. Find only the most important 
                                stats for every team to gain the insight that you need. This website is a work in progress.
                            </p>
                            <div className="flex justify-center relative">
                                <Link href="/teams" prefetch={ true } className="btn h-10 min-h-10 mr-2.5 bg-cyan-400 hover:bg-cyan-300 text-[#1c232b]">Select a team</Link>
                                <button className="btn h-10 min-h-10 border border-cyan-400 text-cyan-400 bg-transparent">View league stats</button>
                            </div>
                        </div>
                    </div>
                </div>       
            </section> 
            <section className="w-full m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                {/*<Leaders teamID={ "" } getLeadersOverview={ false } isLeagueLeader={ true }/>*/}
                <LeagueLeaders />
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <Standings groupNum={"8"} />
                </Suspense>
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <Standings groupNum={"7"} />
                </Suspense>
            </section>
        </>
    )
}