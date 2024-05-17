async function getTeamSchedule( teamID, season ) {
    let output = [];
    const tableHeadings = ["Week", "Date & Time", "Opponent"];

    // fetch the post, regular, and preseason schedules for the chosen team
    for(let counter = 3; counter >= 1; counter -= 1) {
        const res1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/schedule?seasontype=${counter}&season=${season}`, { method: "GET" });
        
        if (!res1.ok) throw new Error('Failed to fetch team schedule');
        
        const schedule = await res1.json();

        // skip empty arrays (occurs for teams that didn't make the playoffs)
        if (schedule.requestedSeason) {
            let weeks = [];
            let pastGames = [];
            let upcomingGames = [];
                
            for (const game of schedule.events) {
                // for reg season games, keep track of their week numbers to find the bye week
                if (schedule.requestedSeason.type == "2") weeks.push(game.week.number);

                let data = {
                    id: game.id, // used in JSX as a key
                    date: game.date,
                    teams: game.competitions[0].competitors,
                    status: game.competitions[0].status,
                    week: game.week,
                    seasonType: game.seasonType
                }
                
                // if the game hasn't happened yet, add the DraftKings spread and over/under
                if (game.competitions[0].status.type.state == "pre") {
                    const fetchGameOdds = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${game.id}/competitions/${game.id}/odds/40`, { method: "GET" });
                    
                    if (!fetchGameOdds.ok) throw new Error('Failed to fetch game details');
                    
                    const gameOdds = await fetchGameOdds.json();

                    data.spread = gameOdds.details;
                    data.overUnder = gameOdds.overUnder;

                    upcomingGames.push(data);
                }
                else pastGames.push(data);
            }

            if (schedule.requestedSeason.type == "2") {
                const byeWeek = findByeWeek(weeks, weeks.length);
                const postByeWeekGame = upcomingGames.find(({ week }) => week.number == byeWeek + 1);

                // determine which array the bye week should be in and add it
                if (postByeWeekGame) {
                    upcomingGames.splice(byeWeek-1, 0, { week: { number: byeWeek }});
                }
                else {
                    pastGames.splice(byeWeek-1, 0, { week: { number: byeWeek }});
                }
            }

            const allGames = [
                {
                    tableHeadings: [...tableHeadings, "Result", "Record"],
                    games: pastGames
                },
                {
                    tableHeadings: [...tableHeadings, "Spread", "Over/Under"],
                    games: upcomingGames
                }
            ];

            output.push({ 
                requestedSeason: schedule.requestedSeason.name, 
                allGames: allGames,
                byeWeek: schedule.requestedSeason.type == "2" && findByeWeek(weeks, weeks.length)
            });
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

export default getTeamSchedule;