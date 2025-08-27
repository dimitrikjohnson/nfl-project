import DefaultLogo from '@/app/images/default_logo.png';
import Image from "next/image";
import Link from 'next/link';
import { idToName } from '@/app/helpers/idToName';
import type { CompetitorTeam, TeamsInGameResult, GameLeader, GameStatus } from "@/app/types/schedule";

// distinguish the chosen team from the non-chosen team in the game
function teamsInGame(teams: any, chosenTeamID: string): TeamsInGameResult {
    const [first, second] = teams;
    const chosenTeam = first.id === chosenTeamID ? first : second;
    const otherTeam = first.id === chosenTeamID ? second : first;

    // the score response may be formatted in 2 different ways 
    const normalizeScore = (score: CompetitorTeam["score"]) => {
        if (score === null || score === undefined) return undefined;

        // Case 1: object with value/displayValue
        if (typeof score === "object") {
            if ("value" in score && score.value !== undefined) return String(score.value);
            if ("displayValue" in score && score.displayValue !== undefined) return score.displayValue;
        }

        // Case 2: already number or string
        return String(score);
    };

    const leaders: GameLeader[] = [];

    chosenTeam.leaders?.map((stat: any) => {
        const leader = stat.leaders[0];

        const slugifyName = leader.athlete.displayName.toLowerCase().replace(' ', '-');

        const link = `/player/${slugifyName}-${leader.athlete.id}`
        leaders.push({
            value: leader.value,
            player: {
                displayName: leader.athlete.displayName,
                shortName: leader.athlete.shortName,
                lastName: leader.athlete.lastName,
                link: link
            }
        });
    });

    return {
        chosenTeam: {
            score: normalizeScore(chosenTeam.score) as string | number | undefined,
            name: chosenTeam.team.displayName,
            homeAway: chosenTeam.homeAway,
            winner: chosenTeam.winner,
            record: chosenTeam.record?.[0]?.displayValue ?? null,
            logo: chosenTeam.team.logos?.[0]?.href,
            leaders: leaders // this is only for the schedule
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
                href={`/teams/${currentName}`} 
                className={`group text-blue-800 dark:text-cyan-400 ${containerClasses}`} 
                title={ teams.otherTeam.name }
            >
                { teams.otherTeam.logo
                    ? <img className={ onlyShortName ? "w-20" : "w-5 md:w-7" } src={ teams.otherTeam.logo } alt={`${teams.otherTeam.name} logo`} />
                    : <Image className="w-4 md:w-6" src={ DefaultLogo }  alt="Default logo" priority />
                }
                <span className="group-hover:underline">
                    <span className={ onlyShortName ? "hidden" : "hidden xl:block" }>{ teams.otherTeam.name }</span>
                    <span className={ onlyShortName ? "" : "xl:hidden"}>{ teams.otherTeam.abbreviation }</span>    
                </span> 
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
        if (gameStatus?.state =="in") {
            return (<> 
                { dateField 
                    ? <>
                        <span className="text-red-600 dark:text-red-400 font-semibold mr-1.5">
                            <span aria-hidden className="animate-pulse">&#8226;</span>
                            <span>LIVE</span>
                        </span>
                        <span>{ gameStatus?.shortDetail }</span>
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

            { gameStatus?.altDetail &&
                <span className="ml-2">{ gameStatus.altDetail }</span>
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