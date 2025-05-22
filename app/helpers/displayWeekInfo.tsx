// function for displaying the week number/text
export default function displayWeek(requestedSeason: string, game: { week: { text: string; number: number; }; }) {
    if (requestedSeason == "Postseason") {
        return game.week.text
    }
    // account for the preseason games being misnumbered because of the Hall of Fame game
    else if (requestedSeason == "Preseason") {
        if (game.week.text == 'Hall of Fame Weekend') { return "HOF"; }
        return game.week.number-1
    }
    else return game.week.number
}