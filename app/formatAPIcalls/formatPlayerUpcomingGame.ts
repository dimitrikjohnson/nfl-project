import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import labelFormatter from "@/app/helpers/labelFormatter";
import { PlayerOverview } from "../types/player";
import getMissingFantasyStats from "../helpers/getMissingFantasyStats";
import findHomeAwayTeam from "../helpers/findHomeAwayTeam";

export type UpcomingGame = {
    weekText: string,
    date?: string,
    time?: string,
    awayTeam: TeamData,
    homeTeam: TeamData
    status: string,
    broadcast: string,
    timeLeft?: string,
    teamWithPossession?: string | false;
    statsInCurrentGame?: {
        longName: string,
        value: string
    }[]
}

type TeamData = {
    id: string,
    abbreviation: string,
    name: string,
    record: string,
    logo: string,
    color: string,
    link: string,
    score?: string 
}

export default async function formatPlayerUpcomingGame(nextGame: any, player: PlayerOverview, includeFantasy: boolean): Promise<UpcomingGame> {
    const game = nextGame.league.events[0];

    const allTeamsColors = teamColors as AllTeamsColors;

    const awayTeam = findHomeAwayTeam(game.competitors, "away");
    const homeTeam = findHomeAwayTeam(game.competitors, "home"); 

    const { date, time } = formatDateAndTime(game.date);

    // establish variables for game-in-progress stats
    let currentGame;
    let timeLeft;
    let awayScore;
    let homeScore;
    let teamWithPossession;
    let statsInCurrentGame: UpcomingGame["statsInCurrentGame"] = [];

    if (game.status == "in") {
        const res = await formatGameInProgressStats(nextGame, game, player, includeFantasy);
        currentGame = res.currentGame;
        timeLeft = res.timeLeft;
        teamWithPossession = res.teamWithPossession;
        awayScore = res.awayScore;
        homeScore = res.homeScore;
        statsInCurrentGame = res.statsInCurrentGame;
    }
    
    return {
        weekText: game.weekText,
        date,
        time,
        status: game.status,
        broadcast: game.broadcast,
        timeLeft,
        teamWithPossession,
        statsInCurrentGame,
        awayTeam: {
            id: awayTeam.id,
            abbreviation: awayTeam.abbreviation,
            name: awayTeam.name,
            record: awayTeam.record,
            logo: awayTeam.logoDark,
            color: allTeamsColors[awayTeam.name.toLowerCase()].bgColor,
            link: `/teams/${awayTeam.name.toLowerCase()}`,
            score: currentGame && awayScore
        },
        homeTeam: {
            id: homeTeam.id,
            abbreviation: homeTeam.abbreviation,
            name: homeTeam.name,
            record: homeTeam.record,
            logo: homeTeam.logoDark,
            color: allTeamsColors[homeTeam.name.toLowerCase()].bgColor,
            link: `/teams/${homeTeam.name.toLowerCase()}`,
            score: currentGame && homeScore
        }
    }
}

// date & time will never actually be undefined; just added it to fix a TypeScript error
export function formatDateAndTime(date: string | undefined) {
    if (date) {
        // if the timezone isn't included, the wrong time will be displayed on production
        const formattedDate = new Date(date).toLocaleString('en-us', {
            timeZone:"America/New_York",
            weekday:"short",
            month:"short", 
            day:"numeric"
        });

        const formattedTime = new Date(date).toLocaleString('en-us', {
            timeZone:"America/New_York",
            hour:"numeric", 
            minute:"numeric",
        });

        return {
            date: formattedDate,
            time: formattedTime
        }    
    }
    return {}
}

async function formatGameInProgressStats(nextGame: any, game: any, player: PlayerOverview, includeFantasy: boolean) {
    const res = await fetch(`https://cdn.espn.com/core/nfl/boxscore?xhr=1&gameId=${game.id}`);
    const currentGame = (await res.json()).gamepackageJSON.header.competitions[0];
    
    const awayTeam = findHomeAwayTeam(currentGame.competitors, "away");
    const homeTeam = findHomeAwayTeam(currentGame.competitors, "home");

    let teamWithPossession;
    // get the ID of the team with the ball (or set it to false if neither team has possession)
    if (awayTeam.possession || homeTeam.possession) {
        if (awayTeam.possession) {
            teamWithPossession = awayTeam.id;
        }
        else {
            teamWithPossession = homeTeam.id;    
        }      
    }
    else {
        teamWithPossession = false;    
    }
        
    const awayScore = awayTeam.score;
    const homeScore = homeTeam.score;

    let timeLeft;
    const statsInCurrentGame = [];

    // display "halftime" if needed
    if (currentGame.status.displayPeriod == "2nd" && currentGame.status.displayClock == "0:00") {
        timeLeft = "Halftime";
    }
    else {
        timeLeft = `${currentGame.status.displayPeriod} - ${currentGame.status.displayClock}`;
    }

    // get a summary of the player's stats
    const summaryStats = nextGame.summaryStatistics; 

    if (summaryStats) {
        for (const stat of summaryStats) {
            // find the index of the summary stat value in the "stats" array
            const indexOfStat = nextGame.statistics.names.indexOf(stat.name);
                
            statsInCurrentGame.push({
                longName: labelFormatter(stat.displayName),
                value: Object.keys(nextGame.statistics).length > 0 ? nextGame.statistics.splits[0].stats[indexOfStat] : "0"
            });
        }  

        if (includeFantasy) {
            statsInCurrentGame.push({
                longName: "FPTS (Half-PPR)",
                value: Object.keys(nextGame.statistics).length > 0 ? await getMissingFantasyStats(game.id, player.id, player.team.id) : "0"
            });
        }    
    } 

    return {
        timeLeft,
        teamWithPossession,
        awayScore,
        homeScore,
        currentGame,
        statsInCurrentGame
    }
}