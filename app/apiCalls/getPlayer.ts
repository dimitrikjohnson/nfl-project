import formatPlayerData from "@/app/formatAPIcalls/formatPlayerData";

export const PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND';

export default async function getPlayer({ playerID }: { playerID: string }) {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}`, {
        method: "GET"
    })

    // let the player layout show a 404 page for IDs that don't exist
    // (ESPN responds with 400 for IDs that don't exist)
    if (res.status === 400 || res.status === 404) throw new Error(PLAYER_NOT_FOUND);

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch player data')

    let data = await res.json();
    
    return await formatPlayerData(data);
}