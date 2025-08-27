import { displayWeek } from "@/app/helpers/displayWeekInfo";

export default async function getNextTwoGames( teamID: any ) {
    let nextTwoGames = [];
    
    // fetch the post, regular, and preseason schedules for the chosen team
    for (let counter = 1; counter <= 3; counter += 1) {
        const res1 = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/schedule?seasontype=${counter}`, { method: "GET" });
        const schedule = await res1.json();   
        
        if (schedule.requestedSeason) {
            for (const game of schedule.events) {
                if (nextTwoGames.length == 2) return nextTwoGames;

                if (game.competitions[0].status.type.state == "pre") {
                    let data = {
                        id: game.id, // used in JSX as a key
                        date: game.date,
                        teams: game.competitions[0].competitors,
                        status: game.competitions[0].status,
                        week: displayWeek(schedule.requestedSeason.name, game.week),
                        network: game.competitions[0].broadcasts.length > 0 ? game.competitions[0].broadcasts[0].media.shortName : "TBD",
                        homeChance: null,
                        awayChance: null,
                        seasonType: game.seasonType
                    }

                    const fetchGameOdds = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${game.id}/competitions/${game.id}/predictor`, { method: "GET" });
                    const gameOdds = await fetchGameOdds.json();
                    
                    if (!gameOdds.error) {
                        data.homeChance = gameOdds["homeTeam"]["statistics"][0].displayValue;
                        data.awayChance = gameOdds["awayTeam"]["statistics"][0].displayValue;
                    }
                    nextTwoGames.push(data);
                }
            }
        }
    }

    return nextTwoGames;
}