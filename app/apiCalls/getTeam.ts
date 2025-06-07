import formatTeamData from "@/app/formatAPIcalls/formatTeamData";

async function getTeam({ teamID }: { teamID: string }) {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}`, {
        method: "GET"
    })

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team data')

    let data = await res.json();
    
    return formatTeamData(data);
}

export default getTeam