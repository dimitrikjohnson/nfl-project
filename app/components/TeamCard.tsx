'use client';
import { useState, useContext } from "react";
import Link from 'next/link';
import { SuperBowlWinner } from "../contextProviders/sbWinnerProvider";
import allTeamsColors from '@/app/data/allTeamsColors.json';
import TeamSummary from "./TeamSummary";

export default function TeamCard({ team }) {
    const [hover, setHover] = useState(false);
    const [hoveredTeam, setHoveredTeam] = useState("");

    const sbWinner = useContext(SuperBowlWinner);

    const handleMouseEnter = (id) => {
        setHover(true);
        setHoveredTeam(id);
    }
 
    const handleMouseLeave = () => setHover(false)

    return (
        <Link
            href={ `/teams/${team.id}` } 
            key={ team.id }
            style={{ 
                backgroundColor: (hover && hoveredTeam == team.id) && allTeamsColors[team.id].bgColor,
                color: (hover && hoveredTeam == team.id) && allTeamsColors[team.id].textColor 
            }}
            onMouseEnter={ () => handleMouseEnter(team.id) }
            onMouseLeave={ () => handleMouseLeave() }
            aria-selected={ sbWinner?.winner == team.id }
            className="group flex items-center gap-2.5 p-2.5 rounded-md bg-sectionColor transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-105 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
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