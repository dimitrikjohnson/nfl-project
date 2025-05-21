import DefaultLogo from '@/app/images/default_logo.png';
import Image from "next/image";
import Link from 'next/link';

// distinguish the chosen team from the non-chosen team in the game
function teamsInGame(teams, chosenTeamID) {
    let chosenTeam = {};
    let otherTeam = {};
    
    if (teams[0].id == chosenTeamID) {
        chosenTeam = teams[0]
        otherTeam = teams[1]
    }
    else {
        chosenTeam = teams[1]
        otherTeam = teams[0]
    }

    return ({
        // the score has a ternary statement because the value could be formatted 2 seperate ways
        chosenTeam: {
            score: chosenTeam.score && (chosenTeam.score.value ? chosenTeam.score.value : chosenTeam.score),
            name: chosenTeam.team.displayName,
            homeAway: chosenTeam.homeAway,
            winner: chosenTeam.winner,
            record: chosenTeam.record != undefined && chosenTeam.record.length > 0 ? chosenTeam.record[0].displayValue : null,
            logo: chosenTeam.team.logos && chosenTeam.team.logos[0].href,
            //score: chosenTeam.score ? chosenTeam.score : null,
            leaders: chosenTeam.leaders // this is only for the schedule
        },
        otherTeam: {
            id: otherTeam.id,
            score: otherTeam.score && (otherTeam.score.value ? otherTeam.score.value : otherTeam.score),
            name: otherTeam.team.displayName,
            abbreviation: otherTeam.team.abbreviation,
            logo: otherTeam.team.logos && otherTeam.team.logos[0].href,
            //score: otherTeam.score ? otherTeam.score : null,
            winner: otherTeam.winner,
        }
    })
}

function displayHomeAway(teamsArgument, chosenTeamID, onlyShortName = false) {
    const teams = teamsInGame(teamsArgument, chosenTeamID);
    
    return (
        <span className={ `flex gap-x-1 md:gap-x-2.5 items-center ${ onlyShortName && " justify-center" }` }>
            <span>{ teams.chosenTeam.homeAway == "home" ? "vs" : "@" }</span>
            { teams.otherTeam.logo
                ? <img className={ onlyShortName ? "w-20" : "w-5 md:w-7" } src={ teams.otherTeam.logo } alt={ teams.otherTeam.name } />
                : <Image className="w-4 md:w-6" src={ DefaultLogo }  alt="Default logo" priority />
            }
            <Link href={ `/teams/${ teams.otherTeam.id }` } className="hover:text-cyan-400 hover:underline" title={ teams.otherTeam.name }>
                <span className={ onlyShortName ? "hidden" : "hidden md:block" }>{ teams.otherTeam.name }</span>
                <span className={ onlyShortName ? "" : "md:hidden"}>{ teams.otherTeam.abbreviation }</span>
            </Link>     
        </span>
    ) 
}

function displayGameResult(teamsArgument, gameStatus, chosenTeamID, dateField = false) {    
    const teams = teamsInGame(teamsArgument, chosenTeamID);
    const endedInTie = teams.chosenTeam.score == teams.otherTeam.score;
    
    // if there is no winner, the game is in progress or was cancelled
    if (teams.chosenTeam.winner == null) {
        if (gameStatus.state =="in") {
            return (<> 
                { dateField 
                    ? <>
                        <span className="animate-pulse text-red-400 font-semibold mr-1.5">LIVE</span>
                        <span>{ gameStatus.shortDetail }</span>
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

            { gameStatus.altDetail &&
                <span className="ml-2">{ gameStatus.altDetail }</span>
            }
        </>
    )
}

function displayRecordAfterGame(teamsArgument, chosenTeamID) {
    const teams = teamsInGame(teamsArgument, chosenTeamID);
    return (
        <span>{ teams.chosenTeam.record }</span>
    )
}

export { displayHomeAway, displayGameResult, displayRecordAfterGame, teamsInGame }