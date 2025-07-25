'use client';
import { useContext } from "react";
import { SuperBowlWinner } from "@/app/contextProviders/sbWinnerProvider";
import { Team } from "@/app/types/team";

export default function TeamSummary({ team, hasTrophy }: { team: Team, hasTrophy: boolean }) {
    const sbWinner = useContext(SuperBowlWinner);
  
    return (
        <>
            { team.record }
            { (team.standingSummary && team.record != "0-0") &&  // don't display standing summary if team is 0-0
                <>
                    <span>&#183;</span>
                    <span>{ team.standingSummary }</span>
                </>
            }
            { (hasTrophy && sbWinner?.winner == team.id) &&
                <span className="font-rubik flex gap-1 items-end">
                    <span>&#183;</span>
                    <span>&#127942;</span>
                </span>
            }
        </>
    )
}

