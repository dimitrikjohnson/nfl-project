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

async function getTeamSchedule({ teamID }) {
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

async function getTeamScheduleDetailed({ teamID, seasonYear, seasonType }) {
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

async function getSuperBowlWinner() {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events", { method: "get" })
    const data = await res.json()
    const mostRecentGame = data.items[0].$ref

    const gameInfo = await fetch(mostRecentGame, { method: "get" })
    var newData = await gameInfo.json()

    const gameHeadline = newData.competitions[0].notes[0].headline
    const gameCompetitors = newData.competitions[0].competitors

    if (gameHeadline.startsWith("Super Bowl")) {
        for (var competitor of gameCompetitors) {
            if (competitor.winner) {
                return {
                    headline: gameHeadline,
                    winnerID: competitor.id
                }
            }
        }
    }

    return null
}

export { getAllTeams, getTeam, getTeamSchedule, getTeamScheduleDetailed, getSuperBowlWinner }