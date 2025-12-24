import { ReactNode } from "react";
import type { Metadata } from "next";
import SkipToContent from "@/app/components/SkipToContent";
import NavBar from "../components/NavBar";
import Image from "next/image";
import Skies from '@/public/skies.png';
import Tabs from "../components/Tabs";

export default async function AlbinoSkiesLayout({ children }: { children: ReactNode }) {
    const tabs = ["overview", "drafts", "history"];

    const leagueID = process.env.ALBINOSKIES_ID!;
    const league = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`).then(res => res.json());

    // only add the 'stats' tab during the fantasy season (any other time, the stats will appear in the 'history' tab)
    if (league.status == "in_season" || league.status == "post_season") {
        tabs.splice(1, 0, "stats");
    }

    return (
        <>
            <SkipToContent /> 
            <section className="relative w-full h-fit">
                <NavBar />
                <Image src={ Skies } className="absolute inset-0 object-cover w-full h-full" alt="Albino Skies logo" priority />
                <div id="content" className="relative z-10 flex items-center justify-center px-4 py-16 md:py-32 max-w-2xl mx-auto">
                    <h1 className="font-protest text-4xl md:text-6xl uppercase text-backdrop-dark">Albino Skies</h1>
                </div> 
            </section>
            <Tabs 
                tabs={ tabs } 
                url="/albinoskies"
            />
            <main>   
                { children }
            </main> 
        </>
    );
}

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Albino Skies",
        description: "Albino Skies is a dynasty fantasy football league. This section of Big Football acts as a hub for the league, as it contains insightful \
                    data, including weekly scores, drafts, and league history."
    };
}
