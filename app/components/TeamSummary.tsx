'use client';
import { useContext } from "react";
import { CurrentSeason } from "@/app/contextProviders/currentSeasonProvider";
import { SuperBowlWinner } from "@/app/contextProviders/sbWinnerProvider";

export default function TeamSummary({ team, hasTrophy }) {
    const currentSeason = useContext(CurrentSeason);
    const sbWinner = useContext(SuperBowlWinner);

    return (
        <>
            { team.record?.items
                ? <span>{ team.record.items?.[0].summary }</span>
                : <span>{ currentSeason }</span>
            }
            { team.standingSummary && 
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