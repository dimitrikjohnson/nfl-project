async function getTeamSchedule( teamID ) {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/" + teamID + "/schedule", {
        method: "GET"
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team record data')
    }

    var data = await res.json()
    return data
}

export default getTeamSchedule