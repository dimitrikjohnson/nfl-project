import { teamsInGame } from "@/app/helpers/displayGameInfo";
import { GameData } from "@/app/types/schedule";

async function formatSchedule(teamID: string, season: string | false | null) {
    let output = [];
    const tableHeadings = ["WK", "Date & Time", "Opponent"];

    // fetch the post, regular, and preseason schedules for the chosen team
    for (let counter = 3; counter >= 1; counter -= 1) {
        let res1;
        
        if (!season) {
            res1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/schedule?xhr=1&seasontype=${counter}`, { method: "GET" });
        }
        else {
            res1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/schedule?xhr=1&seasontype=${counter}&season=${season}`, { method: "GET" }); 
        }
        
        if (!res1.ok) throw new Error('Failed to fetch team schedule');
        
        const schedule = await res1.json();

        // skip empty arrays (for when the team's playoff schedule is empty)
        if (schedule.requestedSeason) {
            let weeks = [];
            let pastGames = [];
            let upcomingGames = [];
            
            for (const game of schedule.events) {                
                // for reg season games, keep track of their week numbers to find the bye week
                if (game.seasonType.type == 2) weeks.push(game.week.number);

                let data: GameData = {
                    id: game.id, // used in JSX as a key
                    date: game.date,
                    teams: game.competitions[0].competitors,
                    status: game.competitions[0].status.type,
                    week: game.week,
                    season: game.season.year,
                    seasonType: game.seasonType
                }
                
                // if the game hasn't happened yet, add the ESPN Bet spread and over/under
                if (game.competitions[0].status.type.state == "pre") {
                    data.network = game.competitions[0].broadcasts.length > 0 ? game.competitions[0].broadcasts[0].media.shortName : "TBD";
                    
                    // an error will be thrown if the spread/odds haven't been added yet
                    try {
                        const fetchGameOdds = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${game.id}/competitions/${game.id}/odds`, { method: "GET" });
                        const gameOdds = await fetchGameOdds.json(); 
              
                        if (gameOdds.error) throw new Error();
          
                        data.spread = gameOdds.items[0].details;
                        data.overUnder = gameOdds.items[0].overUnder;
                    }
                    catch (err) {
                        data.spread= "TBD"; 
                        data.overUnder = "TBD";
                    }
                    
                    upcomingGames.push(data);
                }
                else {
                    data.leaders = teamsInGame(game.competitions[0].competitors, teamID).chosenTeam.leaders;
                    pastGames.push(data);
                }
            }

            if (schedule.requestedSeason.type == "2") {
                const byeWeek = findByeWeek(weeks, weeks.length);
                const postByeWeekGame = upcomingGames.find(({ week }) => week.number == byeWeek + 1);
                
                const scheduleData: GameData = {
                    week: {
                        number: byeWeek,
                        text: ""
                    }       
                };

                // determine which array the bye week should be in and add it
                if (postByeWeekGame) {
                    upcomingGames.splice(upcomingGames.indexOf(postByeWeekGame), 0, scheduleData);
                }
                else {
                    pastGames.splice(byeWeek-1, 0, scheduleData);
                }
            }

            const allGames = [
                {
                    tableHeadings: [...tableHeadings, "Result", "W-L", "Pass Lead", "Rush Lead", "Rec Lead"],
                    games: pastGames
                },
                {
                    tableHeadings: [...tableHeadings, "Network", "Spread", "Over/Under"],
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
function findByeWeek(weeksArray: any[], length: number) {
    let result = Math.floor((length + 1) * (length + 2) / 2);
    for (let i = 0; i < length; i++) result -= weeksArray[i];
    return result;
}

export default formatSchedule;