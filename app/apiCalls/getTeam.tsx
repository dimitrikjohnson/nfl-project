async function getTeam({ teamID }) {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/" + teamID, {
        method: "GET"
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team data')
    }

    var data = await res.json()
    return data.team
}

export default getTeam