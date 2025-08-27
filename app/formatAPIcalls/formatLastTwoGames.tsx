import { displayWeek } from "@/app/helpers/displayWeekInfo";
import formatSchedule from "@/app/formatAPIcalls/formatSchedule";
import { GameData } from "@/app/types/schedule";

export default async function formatLastTwoGames( teamID: string ) {
    const schedule = await formatSchedule(teamID, null);
    
    let games: GameData[] = [];
    
    // loop through the parts of the season (pre, reg, post)
    for (const season of schedule) {
        let numPastGames = season.allGames[0].games.length;

        // if there are no past games in the current part of the season, continue to the next part
        if (numPastGames == 0) { continue; }

        else if (numPastGames == 1 || games.length == 1) {
            games.push(season.allGames[0].games[numPastGames-1]);
        }
        
        else {
            games = [season.allGames[0].games[numPastGames-2], season.allGames[0].games[numPastGames-1]]
        }

        if (games.length == 2) { break; }
    }

    const output = [];

    // loop through the past games that were found and collect the game's data
    for (const game of games) {
        const getLiveRes = await fetch(`https://cdn.espn.com/core/nfl/game?xhr=1&gameId=${game.id}`, { method: "get" });
        const liveRes = await getLiveRes.json();
        
        output.push({
            seasonType: game.seasonType,
            date: game.date,
            week: displayWeek(game.seasonType?.name, game.week),
            teams: game.teams, 
            status: liveRes.gamepackageJSON.header.competitions[0].status.type
        });  
    }

    return output;
}