import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getLastTwoGames( teamID ) {
    const currentSeason = await fetchCurrentSeason()

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/teams/${teamID}/events`, { method: "get" })
    const data = await res.json()
    
    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch the last two games')

    const penultimate = data.items[data.items.length-2]
    const mostRecent = data.items[data.items.length-1]
    const games = [penultimate, mostRecent]
    const seasonType = {
        1: { long: "Preseason", short: "PRE" },
        2: { long: "Regular Season", short: "REG" },
        3: { long: "Postseason", short: "POST" },
        4: "Offseason"
    }

    const playoffWeeks = {
        1: "Wild Card",
        2: "Divisional",
        3: "Conf. Championship",
        5: "Super Bowl"
    }

    const output = []

    for (const game of games) {
        // slice game ID out of the link
        const gameID = game.$ref.slice(game.$ref.indexOf("events/")+7, game.$ref.indexOf('?'))

        const newRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameID}`, { method: "get" })
        const gameSummary = await newRes.json()

        // establish variables for commonly used stuff
        const event = gameSummary.header.competitions[0]
        const teams = gameSummary.boxscore.teams
        const TOTAL_YARDS_POSITION = 7
        const PASSING_YARDS_POSITION = 10
        const RUSHING_YARDS_POSITION = 15

        // determine which team is the chosen team; add stats to output
        let chosenTeamStats = []
        let otherTeamStats = []

        if (teams[0].team.id == teamID) {
            chosenTeamStats = teams[0].statistics
            otherTeamStats = teams[1].statistics
        }
        else {
            otherTeamStats = teams[0].statistics
            chosenTeamStats = teams[1].statistics
        }

        // set the week number. if the game is a playoff game, it sets 'week' to the name of the playoff round
        let week = (gameSummary.header.season.type == 3 ? playoffWeeks[gameSummary.header.week] : gameSummary.header.week);
    
        output.push({
            seasonType: seasonType[gameSummary.header.season.type],
            date: event.date,
            week: week,
            teams: event.competitors,
            status: event.status.type,
            chosenTeamStats: {
                totalYards: Number(chosenTeamStats[TOTAL_YARDS_POSITION].displayValue),
                passingYards: Number(chosenTeamStats[PASSING_YARDS_POSITION].displayValue),
                rushingYards: Number(chosenTeamStats[RUSHING_YARDS_POSITION].displayValue),
                
                totalYardsAllowed: Number(otherTeamStats[TOTAL_YARDS_POSITION].displayValue),
                passingYardsAllowed: Number(otherTeamStats[PASSING_YARDS_POSITION].displayValue),
                rushingYardsAllowed: Number(otherTeamStats[RUSHING_YARDS_POSITION].displayValue),
            }
        })
    }

    return output
}