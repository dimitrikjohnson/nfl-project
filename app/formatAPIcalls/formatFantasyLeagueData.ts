import realNamesJSON from "@/app/data/albinoSkiesUserNames.json";
import { Users, Medians } from "@/app/types/albinoskies";

export default async function formatFantasyLeagueData(leagueId: string, users: any, currentWeek: number, rosters: any) {
    // number of regular season fantasy matchups
    const maxWeeks = 13;    

    // assert the type for realNamesJSON
    const realNames = realNamesJSON as Record<string, string>; 

    // Map roster IDs → display names (or hardcoded real names)
    const rosterToUser: Users = {};
   
    rosters.forEach((roster: any) => {
        const user = users.find((user: any) => user.user_id === roster.owner_id);
        const username: string = user?.display_name || user?.metadata?.team_name || "Unknown";
        
        rosterToUser[roster.roster_id] = { 
            name: realNames[username] || username, // display real name if found
            scores: {},
            record: { wins: roster.settings.wins, losses: roster.settings.losses }, // normal win/loss record
            recordWithMedian: { wins: 0, losses: 0 }, // win/loss record with median (extra win when over median, extra loss when under median)
            pointsFor: roster.settings.fpts + (roster.settings.fpts_decimal / 100),
            weeklyRankings: {},
            gamesOverMedian: 0
        }    
    });

    // Only get data for *completed* weeks
    const lastCompletedWeek = Math.min(currentWeek - 1, maxWeeks);

    // Fetch each week's matchups to get each user's points for each week
    for (let week = 1; week <= lastCompletedWeek; week++) {
        const matchupsRes = await fetch(
            `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`
        );
        if (!matchupsRes.ok) break; // stop if no more weeks yet
        const matchups = await matchupsRes.json();

        // Go through all matchups in pairs to assign scores earned each week (Sleeper uses matchup_id to link opponents)
        matchups.forEach((matchup: any) => {
            rosterToUser[matchup.roster_id].scores[week] = matchup.points;
        });  
    }

    // Compute weekly rankings (use a differnt for loop to stop at the last completed week)
    for (let week = 1; week <= lastCompletedWeek; week++) {    
        const weekScores = Object.entries(rosterToUser).map(([id, user]) => ({
            id,
            name: user.name,
            score: user.scores[week] ?? 0
        }));

        // Sort descending by score
        weekScores.sort((a, b) => b.score - a.score);

        // Compute "how many teams each user beat"
        weekScores.forEach((entry, i) => {
            // Handle ties: average out positions of same-score players
            const tied = weekScores.filter(s => s.score === entry.score);
            const averageRank = tied
                .map(t => weekScores.indexOf(t))
                .reduce((a, b) => a + b, 0) / tied.length;

            const teamsBeaten = weekScores.length - averageRank - tied.length;

            rosterToUser[entry.id].weeklyRankings[week] = Math.max(0, Math.round(teamsBeaten));    
        });
    }

    const medians = calculateWeeklyMedians(rosterToUser);
    
    // compute recordsWithMedian using the regular records + median-based extras
    Object.entries(rosterToUser).forEach(([id, user]) => {
        let extraWins = 0;
        let extraLosses = 0;

        Object.keys(medians).forEach((wk) => {
            const wkNum = Number(wk);
            if (wkNum > lastCompletedWeek) return;

            const score = user.scores[wkNum];
            const median = medians[wk];

            if (typeof score !== "number" || typeof median !== "number") return;

            if (score > median) extraWins += 1;
            else if (score < median) extraLosses += 1;
        });

        // Update recordWithMedian for this user
        rosterToUser[id].recordWithMedian.wins = user.record.wins + extraWins;
        rosterToUser[id].recordWithMedian.losses = user.record.losses + extraLosses;

        // extraWins are the "games over median"
        rosterToUser[id].gamesOverMedian = extraWins;
    });

    const allWeeks = getWeeks(rosterToUser);

    const completedWeeks = getCompletedWeeks(lastCompletedWeek);

    return {
        medians,
        allWeeks,
        completedWeeks,
        users: rosterToUser 
    };
}

// calculate the median score for each week
function calculateWeeklyMedians(users: Users): Medians {
    const weeks = getWeeks(users);
    const medians: Medians = {};

    [...weeks].forEach(week => {
        const weekScores = Object.values(users)
            .map(user => user.scores[week])
            .filter(v => typeof v === "number" && !isNaN(v));

        if (weekScores.length === 0) return;

        weekScores.sort((a, b) => a - b);
        const mid = Math.floor(weekScores.length / 2);
        medians[week] = weekScores.length % 2 !== 0
            ? weekScores[mid]
            : (weekScores[mid - 1] + weekScores[mid]) / 2;
    });

    return medians;
}

// get the weeks that have data + the upcoming week
function getWeeks(users: Users) {
    // create a Set to avoid number duplication
    const weeks = new Set<number>();

    Object.values(users).forEach(user => {
        Object.keys(user.scores).forEach(week => weeks.add(Number(week)));
    }); 

    return Array.from(weeks);
}

// create an array of sequential numbers leading up to the last completed week
function getCompletedWeeks(lastCompletedWeek: number) {
    const completedWeeks = [];
    for (let week = 1; week <= lastCompletedWeek; week += 1) {
        completedWeeks.push(week);
    }

    return completedWeeks;
}