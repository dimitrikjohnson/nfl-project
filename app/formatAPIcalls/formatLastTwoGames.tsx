import displayWeek from "@/app/helpers/displayWeekInfo";
import formatSchedule from "../formatAPIcalls/formatSchedule";

export default async function formatLastTwoGames( teamID ) {
    //const penultimate = data.items[data.items.length-2]
    //const mostRecent = data.items[data.items.length-1]

    const schedule = await formatSchedule(teamID, undefined);

    //console.log(schedule[1]);
    //console.log(schedule[1].allGames[0].games[0].status.type);

    let games = [];
    
    //for (let x = 0; x < schedule.length; x += 1) {
    for (const season of schedule) {
        let numPastGames = season.allGames[0].games.length;
        if (numPastGames == 0) { continue; }
        else if (numPastGames == 1 || games.length == 1) {
            games.push(season.allGames[0].games[numPastGames-1]);
        }
        else {
            games = [season.allGames[0].games[numPastGames-2], season.allGames[0].games[numPastGames-1]]
        }

        if (games.length == 2) { break; }
        //for (const game of season.allGames[0].games) {

        //}
        //season.allGames[0].games.findLast((game, index) => {})
    }
    //console.log(games)
    
    /*
    for (let x = schedule.length-1; x > -1; x -= 1) {
        for (let i = 0; i < schedule[x].allGames[0])
        //games.push()
        //for (const pastGame of schedule[x].allGames[0].games)
    }
        */
    //const games = [penultimate, mostRecent]
    //console.log(schedule[1].allGames[1].games[0].status)
    /*
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
    */
    const output = [];

    for (const game of games) {
        // slice game ID out of the link
        //const gameID = game.$ref.slice(game.$ref.indexOf("events/")+7, game.$ref.indexOf('?'));

        const newRes = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${game.id}`, { method: "get" });
        const gameSummary = await newRes.json();

        // establish variables for commonly used stuff
        const event = gameSummary.header.competitions[0];
        const teams = gameSummary.boxscore.teams;
        const TOTAL_YARDS_POSITION = 7;
        const PASSING_YARDS_POSITION = 10;
        const RUSHING_YARDS_POSITION = 15;

        // determine which team is the chosen team; add stats to output
        let chosenTeamStats = [];
        let otherTeamStats = [];

        if (teams[0].team.id == teamID) {
            chosenTeamStats = teams[0].statistics
            otherTeamStats = teams[1].statistics
        }
        else {
            otherTeamStats = teams[0].statistics
            chosenTeamStats = teams[1].statistics
        }

        // set the week number. if the game is a playoff game, it sets 'week' to the name of the playoff round
        //let week = (gameSummary.header.season.type == 3 ? playoffWeeks[gameSummary.header.week] : gameSummary.header.week);
        //console.log(game);
        
        output.push({
            seasonType: game.seasonType,
            date: event.date,
            week: displayWeek(game.seasonType.name, game),
            teams: game.teams, //event.competitors,
            status: game.status.type,
            chosenTeamStats: {
                totalYards: Number(chosenTeamStats[TOTAL_YARDS_POSITION]?.displayValue),
                passingYards: Number(chosenTeamStats[PASSING_YARDS_POSITION]?.displayValue),
                rushingYards: Number(chosenTeamStats[RUSHING_YARDS_POSITION]?.displayValue),
                
                totalYardsAllowed: Number(otherTeamStats[TOTAL_YARDS_POSITION]?.displayValue),
                passingYardsAllowed: Number(otherTeamStats[PASSING_YARDS_POSITION]?.displayValue),
                rushingYardsAllowed: Number(otherTeamStats[RUSHING_YARDS_POSITION]?.displayValue),
            }
        })
    }

    return output
}