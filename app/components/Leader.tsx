import { PlayerStatLeader } from "@/app/types/statLeaders";
import Link from "next/link";

export default function Leader({ stat }: { stat: PlayerStatLeader }) {
    // if a player is no longer on a team, their jersey number disappears
    // this function accounts for the possibility of a missing number
    function isJerseyNumPresent(num: string | undefined) {
        if (num) return `#${ num }` 
    }

    // on mobile, replace "touchdowns" with "tds"
    const tdMobile = stat.statName.replace("Touchdowns", "tds");
    
    return (
        <div className="w-full bg-section border border-gray-300 dark:bg-section-dark dark:border-none grid justify-center justify-items-center text-center pt-3 px-3 pb-0 rounded-md">
            <p className="hidden lg:block mb-2 uppercase">{ stat.statName }</p>
            <p className="lg:hidden mb-2 uppercase">{ tdMobile }</p>
            <p className="mb-2 font-semibold text-lg">{ stat.statValue }</p>
            <Link href={ stat.playerLink } className="text-blue-800 dark:text-cyan-400 hover:underline">
                { stat.playerName }
            </Link>
            <p className="mb-2 flex gap-1 text-sm text-gray-500 dark:text-lighterSecondaryGrey">
                <span>{ stat.playerPosition }</span> 
                <span>{ isJerseyNumPresent(stat.playerJersey) }</span>
            </p>
            <Link href={ stat.playerLink } className="w-32 md:w-40 rounded-sm shrink-0">
                <img src={ stat.playerHeadshot } alt={ stat.playerName } />
            </Link>
        </div>
    )
}