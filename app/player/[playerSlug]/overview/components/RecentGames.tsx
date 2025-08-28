import getPlayerRecentAndUpcomingGames from "@/app/apiCalls/getPlayerRecentAndUpcomingGames";
import { displayTableBody, displayTableHead } from "@/app/helpers/gameAndCareerTables";
import { RecentGamesType } from "@/app/formatAPIcalls/formatPlayerRecentGames";
import Link from "next/link";

export default async function RecentGames({ playerID, playerSlug } : { playerID: string, playerSlug: string }) {
    const games = await getPlayerRecentAndUpcomingGames(playerID, "recent") as RecentGamesType;

    if (!games) return undefined;

    return (
        <div className="mb-9 md:mb-12">
            <div className="flex items-end justify-between pb-3">
                <h3 className="font-protest text-2xl lg:text-3xl">Previous Games</h3>
                <Link href={`/player/${playerSlug}/games`} className="text-sm lg:text-base text-blue-800 dark:text-cyan-400 hover:underline">
                    More games
                </Link>             
            </div>
            <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto">
                <table className="table-auto w-full text-nowrap overflow-hidden whitespace-nowrap">
                    { displayTableHead(games.headings, "half-ppr") }
                    { displayTableBody(games.headings, games.rows, "half-ppr") }
                </table>    
            </div>
        </div>      
    )    
}