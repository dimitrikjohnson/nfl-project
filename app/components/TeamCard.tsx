import { useState, useContext } from "react";
import { ThisSeason, SuperBowlWinner } from "../page";
import allTeamsColors from "./data/allTeamsColors.json";

export default function TeamCard({ childToParent, team }) {
    const [hover, setHover] = useState(false);
    const [hoveredTeam, setHoveredTeam] = useState("");

    const currentSeason = useContext(ThisSeason);
    const sbWinner = useContext(SuperBowlWinner);

    const handleMouseEnter = (id) => {
        setHover(true);
        setHoveredTeam(id);
    }
 
    const handleMouseLeave = () => setHover(false)

    return (
        <a 
            href="#top-of-page" 
            key={ team.id }
            onClick={ () => childToParent(team.id) }
            style={{ 
                backgroundColor: (hover && hoveredTeam == team.id) ? allTeamsColors[team.id].bgColor : null,
                color: (hover && hoveredTeam == team.id) ? allTeamsColors[team.id].textColor : null
            }}
            onMouseEnter={ () => handleMouseEnter(team.id) }
            onMouseLeave={ () => handleMouseLeave() }
            aria-selected={ sbWinner.winner == team.id }
            className="group flex items-center gap-2.5 p-2.5 rounded-md bg-sectionColor transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-105 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
        >
            <div className="w-20">
                <img src={ team.logo } alt={ `${team.displayName} logo` } />
            </div>
            <div>
                <p className="font-rubik font-semibold mb-1">{ team.displayName }</p>
                <p className="flex gap-1 text-sm text-lighterSecondaryGrey group-hover:text-inherit">
                    { team.record 
                        ? <span>{ team.record }</span>
                        : <span>{ currentSeason }</span>
                    }
                    { team.standingSummary && 
                        <>
                            <span>&#183;</span>
                            <span>{ team.standingSummary }</span>
                        </>
                    }
                </p>
            </div>
        </a>
    )
}