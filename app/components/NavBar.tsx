'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import TeamSummary from '@/app/components/TeamSummary';
import { Team } from '@/app/types/team';
import { PlayerOverview } from '@/app/types/player';

export default function NavBar({ team, player }: { team?: Team, player?: PlayerOverview }) {
    const [scrolledNav, setScrolledNav] = useState(false);

    const allTeamsColors = teamColors as AllTeamsColors;
    const hasTeam = !!team?.id;
    const hasPlayer = !!player?.id;

    const isDashboard = hasTeam || hasPlayer;

    // display colors depending on whether the user is on a Team or Player dashboard
    const bgColor = hasTeam 
        ? allTeamsColors[team.shortDisplayName.toLowerCase()]?.bgColor 
        : hasPlayer && player.team.bgColor;

    const textColor = hasTeam 
        ? allTeamsColors[team.shortDisplayName.toLowerCase()]?.textColor 
        : hasPlayer && player.team.textColor;

    // for applying certain styling when top navbar passes the mid-screen navbar
    useEffect(() => {
        const handleScroll = () => {
            const y = window.scrollY;
            setScrolledNav(y > 350);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header 
            className={`font-rubik fixed w-full flex justify-between py-2.5 px-4 md:px-11 top-0 z-10 ${ 
                scrolledNav && "drop-shadow-md" } ${ 
                isDashboard || "bg-gray-200 dark:bg-backdrop-dark" 
            }`}
            style={ isDashboard ? { backgroundColor: bgColor as string } : undefined }
        >
            <Link 
                href={ '/' } 
                className={ `flex gap-2 items-center text-lg md:text-xl ${ isDashboard || "text-primary dark:text-primary-dark" }`}
                style={{ color: isDashboard 
                    ? textColor as string 
                    : undefined 
                }}
            >
                <FontAwesomeIcon icon={faFootball} rotation={90} className="" />
                <p className="font-protest tracking-wide uppercase">Big Football</p>
            </Link>
            <div 
                className={`${ scrolledNav && (team || player) ? "flex gap-2" : "hidden" } items-center`}
                style={ isDashboard 
                    ? { color: textColor as string } 
                    : undefined 
                }
            >
                <p className="font-semibold">
                    <span className="hidden md:block">{ team?.displayName }</span>
                    <span className="block md:hidden">{ team?.shortDisplayName }</span>
                </p>
                <p className="hidden md:flex text-sm gap-1.5">
                    { hasTeam && <TeamSummary team={ team } hasTrophy={ false }/> }
                </p>
            </div>
            <Link 
                href={ '/teams' } 
                className={`btn h-8 min-h-8 border-0 ${
                    isDashboard ? "" : "bg-cyan-400 text-backdrop-dark"
                }`}
                style={ isDashboard 
                    ? { backgroundColor: textColor as string, color: bgColor as string } 
                    : undefined 
                }
            >
                Teams
            </Link>
            
        </header>
    );
}