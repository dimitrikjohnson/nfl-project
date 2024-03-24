async function getSuperBowlWinner() {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events", { method: "get" })
    const data = await res.json()
    const mostRecentGame = data.items[0].$ref

    const gameInfo = await fetch(mostRecentGame, { method: "get" })
    var newData = await gameInfo.json()

    const gameHeadline = newData.competitions[0].notes[0].headline
    const gameCompetitors = newData.competitions[0].competitors

    if (gameHeadline.startsWith("Super Bowl")) {
        for (var competitor of gameCompetitors) {
            if (competitor.winner) {
                return {
                    headline: gameHeadline,
                    winnerID: competitor.id
                }
            }
        }
    }

    return null
}

export default getSuperBowlWinner