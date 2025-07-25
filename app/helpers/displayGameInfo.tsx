import DefaultLogo from '@/app/images/default_logo.png';
import Image from "next/image";
import Link from 'next/link';
import { idToName } from '@/app/helpers/idToName';
import type { CompetitorTeam, TeamsInGameResult, GameStatus } from "@/app/types/schedule";

// distinguish the chosen team from the non-chosen team in the game
function teamsInGame(teams: CompetitorTeam[], chosenTeamID: string): TeamsInGameResult {
    const [first, second] = teams;
    const chosenTeam = first.id === chosenTeamID ? first : second;
    const otherTeam = first.id === chosenTeamID ? second : first;

    // the score response may be formatted in 2 different ways 
    const normalizeScore = (score: CompetitorTeam["score"]) => {
        if (!score) return undefined;
        if (typeof score === "object" && "value" in score) return score.value ?? undefined;
        return score;
    };

    return {
        chosenTeam: {
            score: normalizeScore(chosenTeam.score) as string | number | undefined,
            name: chosenTeam.team.displayName,
            homeAway: chosenTeam.homeAway,
            winner: chosenTeam.winner,
            record: chosenTeam.record?.[0]?.displayValue ?? null,
            logo: chosenTeam.team.logos?.[0]?.href,
            leaders: chosenTeam.leaders // this is only for the schedule
        },
        otherTeam: {
            id: otherTeam.id,
            score: normalizeScore(otherTeam.score) as string | number | undefined,
            name: otherTeam.team.displayName,
            shortDisplayName: otherTeam.team.shortDisplayName,
            abbreviation: otherTeam.team.abbreviation,
            logo: otherTeam.team.logos?.[0]?.href,
            winner: otherTeam.winner
        }
    };
}

function displayHomeAway(teamsArgument: CompetitorTeam[] | undefined, chosenTeamID: string, onlyShortName = false) {
    if (!teamsArgument) return false;
    
    const teams = teamsInGame(teamsArgument, chosenTeamID);
    const currentName = idToName[teams.otherTeam.id];      // ← name derived from ID

    const containerClasses = `flex gap-x-1 md:gap-x-2.5 items-center ${ onlyShortName && " justify-center" }`;
    
    return (
        <span className={ containerClasses }>
            <span>{ teams.chosenTeam.homeAway == "home" ? "vs" : "@" }</span>
            <Link 
                href={ `/teams/${currentName}` } 
                className={ containerClasses } 
                title={ teams.otherTeam.name }
            >
                { teams.otherTeam.logo
                    ? <img className={ onlyShortName ? "w-20" : "w-5 md:w-7" } src={ teams.otherTeam.logo } alt={ teams.otherTeam.name } />
                    : <Image className="w-4 md:w-6" src={ DefaultLogo }  alt="Default logo" priority />
                }
                <p className="hover:text-cyan-500 dark:hover:text-cyan-400">
                    <span className={ onlyShortName ? "hidden" : "hidden xl:block" }>{ teams.otherTeam.name }</span>
                    <span className={ onlyShortName ? "" : "xl:hidden"}>{ teams.otherTeam.abbreviation }</span>    
                </p> 
            </Link>     
        </span>
    ) 
}

function displayGameResult(teamsArgument: CompetitorTeam[] | undefined, gameStatus: GameStatus | undefined, chosenTeamID: string, dateField = false) {    
    if (!teamsArgument) return false;
    
    const teams = teamsInGame(teamsArgument, chosenTeamID);
    const endedInTie = teams.chosenTeam.score == teams.otherTeam.score;
    
    // if there is no winner, the game is in progress or was cancelled
    if (teams.chosenTeam.winner == null) {
        if (gameStatus?.type?.state =="in") {
            return (<> 
                { dateField 
                    ? <>
                        <span className="animate-pulse text-red-400 font-semibold mr-1.5">LIVE</span>
                        <span>{ gameStatus?.type?.shortDetail }</span>
                    </>
                    : <span className="flex items-center">
                        <span className="flex items-center gap-x-2">
                            <img className="w-5 md:w-7" src={ teams.chosenTeam.logo } alt={ teams.chosenTeam.name } />
                            <span>{ teams.chosenTeam.score }</span>
                        </span>
                        <span> - </span>
                        <span className="flex items-center gap-x-2">
                            <span>{ teams.otherTeam.score }</span>
                            <img className="w-5 md:w-7" src={ teams.otherTeam.logo } alt={ teams.otherTeam.name } />
                        </span>
                    </span> 
                }    
            </>)
        }
        return false;
    }

    return (
        <>
            { endedInTie 
                ? <span className="bg-black/[0.65] px-1.5 mr-2">T</span> 
                : teams.chosenTeam.winner 
                    ? <span className="bg-green-500/[0.7] px-1.5 mr-2">W</span> 
                    : <span className="bg-red-500/[0.7] px-1.5 mr-2">L</span>  
            }

            <span>{ teams.chosenTeam.score + "-" + teams.otherTeam.score }</span>  

            { gameStatus?.type?.altDetail &&
                <span className="ml-2">{ gameStatus.type.altDetail }</span>
            }
        </>
    )
}

function displayRecordAfterGame(teamsArgument: CompetitorTeam[] | undefined, chosenTeamID: string) {
    if (!teamsArgument) return false;
    const teams = teamsInGame(teamsArgument, chosenTeamID);

    return (
        <span>{ teams.chosenTeam.record }</span>
    )
}

export { displayHomeAway, displayGameResult, displayRecordAfterGame, teamsInGame }