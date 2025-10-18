'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import { Team } from '@/app/types/team';
import { PlayerOverview } from '@/app/types/player';
import SearchBar from './SearchBar';
import getCurrentPath from '../helpers/useCurrentPath';

export default function NavBar({ team, player }: { team?: Team, player?: PlayerOverview }) {
    const [scrolledNav, setScrolledNav] = useState(false);

    const allTeamsColors = teamColors as AllTeamsColors;
    const hasTeam = !!team?.id;
    const hasPlayer = !!player?.id;

    const isDashboard = hasTeam || hasPlayer;

    const onTeamsPage = getCurrentPath() == "teams";

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
        <nav 
            className={`w-full flex justify-between py-2.5 px-4 md:px-6 lg:px-14 top-0 z-30 ${ 
                scrolledNav && "drop-shadow-md" } ${ 
                isDashboard ? "sticky" : "relative bg-transparent" 
            }`}
            style={ isDashboard ? { backgroundColor: bgColor as string } : undefined }
        >
            <Link 
                href={ '/' } 
                className={`flex gap-2 items-center text-lg md:text-xl ${ onTeamsPage && "text-primary dark:text-primary-dark" }`}
                style={{ color: isDashboard 
                    ? textColor as string   // if displaying team/player dashboard, logo should match text color
                    : onTeamsPage           // if displaying the Teams page, logo should switch colors with light/dark mode
                        ? undefined
                        : "#ffffff" 
                }}
            >
                <FontAwesomeIcon icon={faFootball} rotation={90} className="" />
                <p className="font-protest tracking-wide uppercase">Big Football</p>
            </Link>
            <div className="flex items-center gap-3 md:gap-2.5">
                <SearchBar /> 
                <Link 
                    href={ '/teams' } 
                    className={`btn px-3 h-7 min-h-7 md:h-8 md:min-h-8 border-0 ${
                        isDashboard ? "" : "bg-cyan-400 hover:bg-cyan-300 text-backdrop-dark"
                    }`}
                    style={ isDashboard 
                        ? { backgroundColor: textColor as string, color: bgColor as string } 
                        : undefined 
                    }
                >
                    Teams
                </Link>   
            </div>
        </nav>
    );
}