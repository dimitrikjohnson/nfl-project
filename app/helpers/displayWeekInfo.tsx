import { GameData } from "@/app/types/schedule";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

// function for displaying the week number/text
export default function displayWeek(requestedSeason: string | undefined, game: GameData["week"]) {
    if (requestedSeason == "Postseason") {
        if (game.text == "Divisional Round") {
            return (
                <>
                    <span className="md:hidden">Div. Round</span>
                    <span className="hidden md:block">{ game.text }</span>
                </>
            )
        }
        else if (game.text == "Super Bowl") {
            return (
                <>
                    <span>{ game.text }</span>
                    <FontAwesomeIcon icon={faTrophy} className="hidden md:inline-flex ml-2 text-gold dark:text-gold-dark" /> 
                </> 
            )
        }
        else if (game.text == "Conference Championship") {
            return (
                <>
                    <span className="md:hidden">Conf. Champ</span>
                    <span className="hidden md:block">{ game.text }</span>
                </>
            )
        } 
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