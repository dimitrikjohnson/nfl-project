import { GameData } from "@/app/types/schedule";

// function for displaying the week number/text
export default function displayWeek(requestedSeason: string | undefined, game: GameData["week"]) {
    if (requestedSeason == "Postseason") {
        return game.text
    }
    // account for the preseason games being misnumbered because of the Hall of Fame game
    else if (requestedSeason == "Preseason") {
        if (game == undefined) { return "" }
        
        if (game.text == 'Hall of Fame Weekend') { return "HOF"; }   
        return game.number-1
    }
    else return game.number
}