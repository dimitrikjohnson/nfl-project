import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import { calculateGameFantasyPoints } from "@/app/helpers/calculateFantasyPoints";
import { formatlabel } from "./formatPlayerStatsSummary";

export type UpcomingGame = {
    weekText: string,
    date: string,
    time: string,
    awayTeam: TeamData,
    homeTeam: TeamData
    status: string,
    broadcast: string,
    location: string,
    timeLeft?: string,
    statsInCurrentGame?: {
        longName: string,
        value: string
    }[]
}

type TeamData = {
    abbreviation: string,
    name: string,
    record: string,
    logo: string,
    color: string,
    link: string,
    score?: string 
}

export default async function formatPlayerUpcomingGame(nextGame: any, includeFantasy: boolean): Promise<UpcomingGame> {
    const game = nextGame.league.events[0];

    const allTeamsColors = teamColors as AllTeamsColors;

    const awayTeam = findTeam(game.competitors, "away");
    const homeTeam = findTeam(game.competitors, "home"); 

    const { date, time } = formatDateAndTime(game.date);

    // establish variables for game-in-progress stats
    let currentGame;
    let timeLeft;
    let awayScore;
    let homeScore;
    let statsInCurrentGame: UpcomingGame["statsInCurrentGame"] = [];

    if (game.status == "in") {
        const res = await formatGameInProgressStats(nextGame, game, includeFantasy);
        currentGame = res.currentGame;
        timeLeft = res.timeLeft;
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
        location: game.location,
        timeLeft,
        statsInCurrentGame,
        awayTeam: {
            abbreviation: awayTeam.abbreviation,
            name: awayTeam.name,
            record: awayTeam.record,
            logo: awayTeam.logoDark,
            color: allTeamsColors[awayTeam.name.toLowerCase()].bgColor,
            link: `/teams/${awayTeam.name.toLowerCase()}`,
            score: currentGame && awayScore
        },
        homeTeam: {
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

// distinguish teams in "competitors" arrays
function findTeam(teams: any, homeAway: string) {
    return teams.find((competitor: { homeAway: string }) => competitor.homeAway == homeAway);
}

function formatDateAndTime(date: string) {
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

async function formatGameInProgressStats(nextGame: any, game: any, includeFantasy: boolean) {
    const res = await fetch(`https://cdn.espn.com/core/nfl/boxscore?xhr=1&gameId=${game.id}`);
    const currentGame = (await res.json()).gamepackageJSON.header.competitions[0];
    
    const awayScore = findTeam(currentGame.competitors, "away").score;
    const homeScore = findTeam(currentGame.competitors, "home").score;

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
                longName: formatlabel(stat.displayName),
                value: Object.keys(nextGame.statistics).length > 0 ? nextGame.statistics.splits[0].stats[indexOfStat] : "0"
            });
        }  

        if (includeFantasy) {
            statsInCurrentGame.push({
                longName: "FPTS (Half-PPR)",
                value: Object.keys(nextGame.statistics).length > 0 ? calculateGameFantasyPoints(nextGame.statistics.splits[0].stats, nextGame.statistics.names).halfPPR : "0"
            });
        }    
    } 

    return {
        timeLeft,
        awayScore,
        homeScore,
        currentGame,
        statsInCurrentGame
    }
}