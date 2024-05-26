// function for displaying the week number/text
export default function displayWeek(requestedSeason, gamesArr, game) {
    if (requestedSeason == "Postseason") {
        return game.week.text
    }
    else if (requestedSeason == "Preseason" && gamesArr[0].week.number != 1) {
        return game.week.number - 1
    }
    else return game.week.number
}