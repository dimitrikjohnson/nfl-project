'use client';
import { useState, useContext } from "react";
import Link from 'next/link';
import { SuperBowlWinner } from "@/app/contextProviders/sbWinnerProvider";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import TeamSummary from '@/app/components/TeamSummary';
import { Team } from '@/app/types/team';

export default function TeamCard({ team }: { team: Team }) {
    const [hover, setHover] = useState(false);
    const [hoveredTeam, setHoveredTeam] = useState("");

    const sbWinner = useContext(SuperBowlWinner);
    const allTeamsColors = teamColors as AllTeamsColors;

    const handleMouseEnter = (id: string) => {
        setHover(true);
        setHoveredTeam(id);
    }
 
    const handleMouseLeave = () => setHover(false);

    return (
        <Link
            href={ `/teams/${team.id}` } 
            key={ team.id }
            style={{ 
                backgroundColor: (hover && hoveredTeam == team.id) ? allTeamsColors[team.id].bgColor : undefined,
                color: (hover && hoveredTeam == team.id) ? allTeamsColors[team.id].textColor : undefined
            }}
            onMouseEnter={ () => handleMouseEnter(team.id) }
            onMouseLeave={ () => handleMouseLeave() }
            aria-selected={ sbWinner?.winner == team.id }
            className="group flex items-center gap-2.5 p-2.5 rounded-md bg-sectionColor transition ease-in-out delay-50 hover:-translate-y-1 md:hover:scale-105 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
        >
            <div className="w-20">
                <img src={ team.logo } alt={ `${team.displayName} logo` } />
            </div>
            <div>
                <p className="font-rubik font-semibold mb-1">{ team.displayName }</p>
                <p className="flex gap-1 text-sm text-lighterSecondaryGrey group-hover:text-inherit">
                    <TeamSummary team={ team } hasTrophy={ false } />
                </p>
            </div>
        </Link>
    )
}