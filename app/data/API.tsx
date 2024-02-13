async function getAllTeams() {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams", {
        method: "GET"
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch all teams data')
    }

    var data = await res.json()
    var teams = data.sports[0].leagues[0].teams
    return teams
}

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

async function getTeamRecord({ teamID }) {
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

async function getTeamSchedule({ teamID, seasonYear, seasonType }) {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/" + teamID + "/schedule?season=" + seasonYear + "&seasontype=" + seasonType, {
        method: "GET"
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team schedule data')
    }

    var data = await res.json()
    return data
}

export { getAllTeams, getTeam, getTeamRecord, getTeamSchedule }