import { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from 'next/navigation';
import Tabs from '@/app/components/Tabs';
import getPlayer from "@/app/apiCalls/getPlayer";
import PlayerHeader from "./components/PlayerHeader";
import SkipToContent from "@/app/components/SkipToContent";

interface PlayerLayoutProps {
    children: ReactNode;
    params: Promise<{
        playerSlug: string;
    }>;
}

export default async function PlayerLayout({ children, params }: PlayerLayoutProps) {
    const { playerSlug } = await params; 
    const tabs = ['overview', 'games', 'career', 'news'];
    
    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234')
    const playerID = playerSlug.substring(playerSlug.lastIndexOf('-')+1);

    const player = await getPlayer({ playerID });

    // handle invalid player
    if (!playerSlug) return notFound();
    
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

    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234')
    const playerID = playerSlug.substring(playerSlug.lastIndexOf('-')+1);

    const player = await getPlayer({ playerID });

    return {
        title: {
            absolute: `${player.name} - ${player.onATeam ? player.team.longName : player.status.name} ${player.position.name}`
        },
        description: `An overview of ${player.name}'s most recent season and career.`,
    };
    
}
