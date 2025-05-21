import displayWeek from "@/app/helpers/displayWeekInfo";

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
                        week: displayWeek(schedule.requestedSeason.name, game),
                        network: game.competitions[0].broadcasts.length > 0 ? game.competitions[0].broadcasts[0].media.shortName : "TBD",
                        //venue: game.competitions[0].venue,
                        //season: game.season.year,
                        //spread: null,
                        //overUnder: null,
                        homeChance: null,
                        awayChance: null,
                        seasonType: game.seasonType
                    }

                    //data.network = game.competitions[0].broadcasts.length > 0 ? game.competitions[0].broadcasts[0].media.shortName : "TBD";
                    
                    // an error will be thrown if the spread/odds haven't been added yet
                    //try {
                        //const fetchGameOdds = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${game.id}/competitions/${game.id}/odds`, { method: "GET" });
                    const fetchGameOdds = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events/${game.id}/competitions/${game.id}/predictor`, { method: "GET" });
                    const gameOdds = await fetchGameOdds.json();
                    
                    if (!gameOdds.error) {
                        data.homeChance = gameOdds["homeTeam"]["statistics"][0].displayValue;
                        data.awayChance = gameOdds["awayTeam"]["statistics"][0].displayValue;
                    }
              
                        //if (gameOdds.error) throw new Error();
                    /*
                        if (!gameOdds.error) {
                            data.spread = gameOdds.items[0]?.details;
                            data.overUnder = gameOdds.items[0]?.overUnder;
                        }
                        else if (gameOdds.error) {
                            data.spread= "TBD"; 
                            data.overUnder = "TBD";
                        }
                    */
                        //data.spread = gameOdds.items[0] ? gameOdds.items[0].details : "TBD";
                        //data.overUnder = gameOdds.items[0] ? gameOdds.items[0].overUnder : "TBD";
                    //}
                    /*
                    catch (err) {
                        //data.spread= "TBD"; 
                        //data.overUnder = "TBD";
                    }
                    */
                    nextTwoGames.push(data);
                }
            }
        }
    }

    return nextTwoGames;
}