async function getTeamScheduleDetailed( teamID ) {
    let output = [];

    // fetch the post, regular, and preseason schedules for the chosen team
    for(let counter = 3; counter >= 1; counter -= 1) {
        const res1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/schedule?seasontype=${counter}`, { method: "GET" });
        
        if (!res1.ok) throw new Error('Failed to fetch team season data');
        
        const schedule = await res1.json();

        // skip empty arrays (occurs for teams that didn't make the playoffs)
        if (schedule.requestedSeason) {
            if (schedule.requestedSeason.type == "2") {
                let weeks = [];
                
                for (const game of schedule.events) {
                    weeks.push(game.week.number)
                }
                const byeWeek = findByeWeek(weeks, weeks.length);
                
                schedule.events.splice(byeWeek-1, 0, { week: { number: byeWeek }});
                output.push({ requestedSeason: schedule.requestedSeason.name, games: schedule.events, byeWeek: byeWeek });
            }
            // the pre and post seasons don't need the byeWeek value
            else {
                output.push({ requestedSeason: schedule.requestedSeason.name, games: schedule.events, byeWeek: null });
            }
        }
    }
    
    return output;
}

// determine the bye week by finding the missing week in the schedule
function findByeWeek(weeksArray, length) {
    let result = Math.floor((length + 1) * (length + 2) / 2);
    for (let i = 0; i < length; i++) result -= weeksArray[i];
    return result;
}

export default getTeamScheduleDetailed;