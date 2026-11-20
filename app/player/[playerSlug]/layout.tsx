import { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import Tabs from '@/app/components/Tabs';
import { getPlayerIDOrNotFound, getPlayerOrNotFound } from "@/app/helpers/routeGuards";
import PlayerHeader from "./components/PlayerHeader";
import SkipToContent from "@/app/components/SkipToContent";

/*
 * Cache each player page after its first visit and re-render it at most once an hour.
 * Returning an empty array means no players are built ahead of time; pages are generated on demand and then served from the cache,
 * so repeat visits (including bots) don't use server CPU.
*/
export const revalidate = 3600;

export async function generateStaticParams() {
    return [];
}

interface PlayerLayoutProps {
    children: ReactNode;
    params: Promise<{
        playerSlug: string;
    }>;
}

export default async function PlayerLayout({ children, params }: PlayerLayoutProps) {
    const { playerSlug } = await params; 
    const tabs = ['overview', 'games', 'career', 'news'];

    const playerID = getPlayerIDOrNotFound(playerSlug);
    const player = await getPlayerOrNotFound(playerID);

    return (
        <>
            <SkipToContent />       
            <PlayerHeader player={ player } />
            <Tabs 
                tabs={ tabs } 
                url={`/player/${playerSlug}`} 
            />
            <main id="#content" className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                <Suspense fallback={<div className="skeleton w-full h-14"></div>}>
                    { children }  
                </Suspense>   
            </main> 
        </>
    );
    
}

export async function generateMetadata({ params }: { params: Promise<{ playerSlug: string }> }): Promise<Metadata> {
    const { playerSlug } = await params;

    const playerID = getPlayerIDOrNotFound(playerSlug);
    const player = await getPlayerOrNotFound(playerID);

    return {
        title: {
            absolute: `${player.name} - ${player.onATeam ? player.team.longName : player.status.name} ${player.position.name}`
        },
        description: `An overview of ${player.name}'s most recent season and career.`,
    };
    
}
