import { fantasyPositions } from '@/app/data/fantasyPositions';
import formatPlayerUpcomingGame, { formatDateAndTime } from '@/app/formatAPIcalls/formatPlayerUpcomingGame';
import formatPlayerRecentGames from '@/app/formatAPIcalls/formatPlayerRecentGames';
import getPlayer from './getPlayer';
import formatSchedule from '../formatAPIcalls/formatSchedule';
import { FormattedSchedule } from "@/app/types/schedule";
import getTeamRecord from '../helpers/getTeamRecord';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import getTeamLogo from '../helpers/getTeamLogo';
import findHomeAwayTeam from '../helpers/findHomeAwayTeam';

export default async function getPlayerRecentAndUpcomingGames(playerID: string, type: "recent" | "upcoming") {
    const res = await fetch(`https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/${playerID}/overview`);
    const data = await res.json();

    const player = await getPlayer({ playerID });

    const includeFantasy = fantasyPositions.includes(player.position.abbreviation);

    // format the response based on what's needed
    if (type == "recent" && data.gameLog?.events) {
        return await formatPlayerRecentGames(data.gameLog, player, includeFantasy);
    }
    else if (type == "upcoming") { 
        if (data.nextGame?.displayName == "Current Game") {
            return await formatPlayerUpcomingGame(data.nextGame, player, includeFantasy);    
        }

        if (player.onATeam) {
            // if the next game has not already started, get it from the team's schedule
            const schedule = await formatSchedule(player.team.id, null);
            return getNextGame(schedule);   
        }        
    }

    return undefined;
}

async function getNextGame(schedule: FormattedSchedule[]) {
    const upcomingGames = schedule[0].allGames[1].games;
    if (upcomingGames.length == 0) return undefined;
    
    // if the next game doesn't have an ID (aka it's a bye week), display the following game
    const game = upcomingGames[0].id ? upcomingGames[0] : upcomingGames[1];
    
    const { date, time } = formatDateAndTime(game.date);
    
    const awayTeam = findHomeAwayTeam(game.teams, "away").team;
    const homeTeam = findHomeAwayTeam(game.teams, "home").team; 
    
    const allTeamsColors = teamColors as AllTeamsColors;
    
    return {
        weekText: game.week.text,
        date,
        time,
        status: game.status?.state,
        broadcast: game.network,
        awayTeam: {
            abbreviation: awayTeam.abbreviation,
            name: awayTeam.shortDisplayName,
            record: await getTeamRecord(awayTeam.id),
            logo: getTeamLogo(awayTeam),
            color: allTeamsColors[awayTeam.shortDisplayName.toLowerCase()].bgColor,
            link: `/teams/${awayTeam.shortDisplayName.toLowerCase()}`,
        },
        homeTeam: {
            abbreviation: homeTeam.abbreviation,
            name: homeTeam.shortDisplayName,
            record: await getTeamRecord(homeTeam.id),
            logo: getTeamLogo(homeTeam),
            color: allTeamsColors[homeTeam.shortDisplayName.toLowerCase()].bgColor,
            link: `/teams/${homeTeam.shortDisplayName.toLowerCase()}`,
        }
    
    }
}
