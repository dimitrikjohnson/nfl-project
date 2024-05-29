async function getTeam({ teamID }) {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}`, {
        method: "GET"
    })

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team data')

    let data = await res.json()
    return data.team
}

export default getTeam