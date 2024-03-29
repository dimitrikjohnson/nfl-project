async function getTeamScheduleDetailed( teamID, seasonYear ) {
    let output = []

    // fetch to get the team's bye week (the bye week in the team schedule API is incorrect for some teams)
    const res = await fetch("https://fantasy.espn.com/apis/v3/games/ffl/seasons/" + seasonYear + "?view=proTeamSchedules_wl", { method: "get" })
    if (!res.ok) 
        throw new Error('Failed to fetch team bye week data') 
    
    const data = await res.json()
    //var chosenTeam, byeWeek

    //try {
        const chosenTeam = data[0].settings.proTeams.find(team => team.id == teamID)
        const byeWeek = chosenTeam.byeWeek
    //}
    //catch (TypeError) {
        // "settings" and "byeWeek" will be undefined after choosing multiple teams; seemingly has no effect on website
    //}

    // fetch the post, regular, and preseason schedules for the chosen team
    for(let counter = 3; counter >= 1; counter -= 1) {
        const res1 = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/" + teamID + "/schedule?season=" + seasonYear + "&seasontype=" + counter, { method: "GET" })
        
        if (!res1.ok) 
            throw new Error('Failed to fetch team season data') 
        
        const data1 = await res1.json()

        // skip empty arrays (occurs for teams that didn't make the playoffs)
        if (data1.requestedSeason) {
            if (data1.requestedSeason.type == "2") {
                data1.events.splice(byeWeek-1, 0, { week: { number: byeWeek }})
                output.push({ requestedSeason: data1.requestedSeason.name, games: data1.events, byeWeek: byeWeek })
            }
            else {
                output.push({ requestedSeason: data1.requestedSeason.name, games: data1.events, byeWeek: null })
            }
        }
    }
    
    return output
}

export default getTeamScheduleDetailed