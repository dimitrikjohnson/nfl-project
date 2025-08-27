import formatPlayerData from "@/app/formatAPIcalls/formatPlayerData";

export default async function getPlayer({ playerID }: { playerID: string }) {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}`, {
        method: "GET"
    })

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch player data')

    let data = await res.json();
    
    return await formatPlayerData(data);
}