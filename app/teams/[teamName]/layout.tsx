import { ReactNode } from "react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from 'next/navigation';
import TeamHeader from '@/app/teams/[teamName]/components/TeamHeader';
import Tabs from '@/app/components/Tabs';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import SkipToContent from "@/app/components/SkipToContent";

interface TeamLayoutProps {
    children: ReactNode;
    params: Promise<{
        teamName: string;
    }>;
}

export default async function TeamLayout({ children, params }: TeamLayoutProps) {
    const { teamName } = await params; 
    const tabs = ['overview', 'schedule', 'roster', 'statistics'];

    // handle invalid team names
    if (!teamName) return notFound();

    return (
        <>
            <SkipToContent />
            <TeamHeader teamName={ teamName } />
            <Tabs 
                tabs={ tabs } 
                url={ `/teams/${teamName}` } 
            />
            <main id="content" className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                <Suspense fallback={<div className="skeleton w-full h-14"></div>}>
                    {children}  
                </Suspense>   
            </main> 
        </>
    );
}

export async function generateMetadata({ params }: { params: Promise<{ teamName: string }> }): Promise<Metadata> {
    const { teamName } = await params;
  
    const allTeamsColors = teamColors as AllTeamsColors;
    const team = allTeamsColors[teamName];

    if (!team) {
        return {
            title: 'Team Not Found',
            description: 'Team does not exist.',
        };
    }

    return {
        title: `${team.fullName} | Big Football`,
        description: `An overview of the ${team.fullName}' season, including stat leaders, rankings, division standings, and more.`,
    };
}
