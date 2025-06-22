'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import TeamSummary from '@/app/components/TeamSummary';
import { Team } from '@/app/types/team';

export default function NavBar({ team }: { team?: Team }) {
    const [scrolledNav, setScrolledNav] = useState(false);

    const allTeamsColors = teamColors as AllTeamsColors;
    const hasTeam = !!team?.id;

    const teamBgColor = hasTeam && allTeamsColors[team.shortDisplayName.toLowerCase()]?.bgColor;
    const teamTextColor = hasTeam && allTeamsColors[team.shortDisplayName.toLowerCase()]?.textColor;

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
            className={`font-rubik fixed w-full flex justify-between py-2.5 px-4 md:px-11 top-0 z-10 ${ 
                scrolledNav && "drop-shadow-md" } ${ 
                hasTeam || "bg-gray-200 dark:bg-backdrop-dark" 
            }`}
            style={ hasTeam ? { backgroundColor: teamBgColor as string } : undefined }
        >
            <Link 
                href={ '/' } 
                className={ `flex gap-2 items-center text-lg md:text-xl ${ hasTeam || "text-primary dark:text-primary-dark" }`}
                style={{ color: hasTeam 
                    ? teamTextColor as string 
                    : undefined 
                }}
            >
                <FontAwesomeIcon icon={faFootball} rotation={90} className="" />
                <p className="font-protest tracking-wide uppercase">Big Football</p>
            </Link>
            <div 
                className={`${ scrolledNav && team ? "flex gap-2" : "hidden" } items-center`}
                style={ hasTeam 
                    ? { color: teamTextColor as string } 
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
            <div className="items-center gap-3">
                <Link 
                    href={ '/teams' } 
                    className={`btn h-8 min-h-8 border-0 ${
                        hasTeam ? "" : "bg-cyan-400 text-backdrop-dark"
                    }`}
                    style={ hasTeam 
                        ? { backgroundColor: teamTextColor as string, color: teamBgColor as string } 
                        : undefined 
                    }
                >
                    Teams
                </Link>
            </div>
        </nav>
    );
}