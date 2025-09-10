import getPlayer from "@/app/apiCalls/getPlayer";
import Bio from "./components/Bio";
import StatsSummary from "./components/StatsSummary";
import InjuryStatus from "./components/InjuryStatus";
import NewsArticles from "@/app/components/NewsArticles";
import { Suspense } from "react";
import NextGame from "./components/NextGame";
import RecentGames from "./components/RecentGames";

export default async function OverviewTab({ params }: { params: Promise<{ playerSlug: string }>}) {
    const { playerSlug } = await params; 
    
    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234')
    const playerID = playerSlug.substring(playerSlug.lastIndexOf('-')+1);
    
    const player = await getPlayer({ playerID });

    return (
        <>
            <h2 className="font-protest text-3xl lg:text-4xl uppercase pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark">Overview</h2>
            <div className="grid grid-cols-1 xl:flex gap-x-7 gap-y-9">
                <div className="order-2 xl:order-1 xl:basis-3/4">
                    <Suspense fallback={<div className="skeleton w-full h-32 mb-8"></div>}>
                        <NextGame playerID={ playerID } />
                    </Suspense>
                    { player.statsSummary &&
                        <Suspense fallback={<div className="skeleton w-full h-32"></div>}>
                            <StatsSummary summary={ player.statsSummary } />    
                        </Suspense>    
                    }   
                    <Suspense fallback={<div className="skeleton w-full h-32"></div>}>
                        <RecentGames playerID={ playerID } playerSlug={ playerSlug } />
                    </Suspense>
                    <Suspense fallback={<div className="skeleton w-full h-32"></div>}>
                        <NewsArticles type="playerOverview" id={ playerID } playerSlug={ playerSlug } />
                    </Suspense>  
                </div>
                <div className="order-1 md:grid md:grid-cols-2 gap-5 xl:block xl:order-2 xl:basis-1/4">
                    { player.injury && 
                        <InjuryStatus injury={ player.injury } />        
                    }
                    <Suspense fallback={<div className="skeleton w-full h-32"></div>}>
                        <Bio player={ player } />
                    </Suspense>    
                </div>   
            </div>            
        </>         
    )
}