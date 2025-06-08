import replaceHttp from "@/app/helpers/replaceHttp";

async function getSuperBowlWinner() {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events", { method: "get" });
    const data = await res.json();
    const mostRecentGame = replaceHttp(data.items[0].$ref);
    
    const gameInfo = await fetch(mostRecentGame, { method: "get" });
    const newData = await gameInfo.json();

    // this throws an error during the season; fine in the offseason
    try {
      var gameHeadline = newData.competitions[0].notes[0].headline;
    }
    catch (err) {
        return null;
    }

    const gameCompetitors = newData.competitions[0].competitors;

    if (gameHeadline.startsWith("Super Bowl")) {
        for (let competitor of gameCompetitors) {
            if (competitor.winner) {
                return {
                    headline: gameHeadline,
                    winnerID: competitor.id
                }
            }
        }
    }

    return null;
}

export default getSuperBowlWinner;