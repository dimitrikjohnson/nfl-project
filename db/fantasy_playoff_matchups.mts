import { sql } from "./dbConnect.mts";

type SleeperRoster = {
    roster_id: number;
    owner_id: string;
};

type SleeperBracketRow = {
    r: number;          // round
    m: number;          // matchup id
    t1?: number;        // team 1 roster id
    t2?: number;        // team 2 roster id
    t1_from?: { w?: number; l?: number };
    t2_from?: { w?: number; l?: number };
    w?: number;        // winner roster id
    l?: number;        // loser roster id
};

function buildRosterToUserMap(rosters: SleeperRoster[]) {
    const map = new Map<number, string>();
    for (const r of rosters) {
        map.set(r.roster_id, r.owner_id);
    }
    return map;
}

// Generic bracket processor
async function processBracket(leagueID: string, season: number, bracket: "winners" | "losers", leagueUsers: any, rosterToUser: Map<number, string>) {
    const url = `https://api.sleeper.app/v1/league/${leagueID}/${bracket}_bracket`;
    
    const rows: SleeperBracketRow[] = await fetch(url).then((r) => r.json());

    console.log(`ℹ️  Seeding ${bracket} bracket (${rows.length} rows)`);

    for (const row of rows) {
        const team1ID = row.t1 != null ? rosterToUser.get(row.t1) ?? null : null;
        const team2ID = row.t2 != null ? rosterToUser.get(row.t2) ?? null : null;

        const team1 = leagueUsers.find((user: any) => user.user_id === team1ID);
        const team2 = leagueUsers.find((user: any) => user.user_id === team2ID);

        const winnerID = row.w != null ? rosterToUser.get(row.w) ?? null : null;
        const loserID = row.l != null ? rosterToUser.get(row.l) ?? null : null;

        await sql`
            INSERT INTO fantasy_playoff_matchups (
                season,
                league_id,
                bracket,       -- "winners" | "losers"
                round,
                matchup_id,
                team1_user_id,
                team1_avatar,
                team1_name,
                team2_user_id,
                team2_avatar,
                team2_name,
                winner_user_id,
                loser_user_id
            )
            VALUES (
                ${season},
                ${leagueID},
                ${bracket},
                ${row.r},
                ${row.m},
                ${team1ID},
                ${team1?.metadata.avatar},
                ${team1?.metadata.team_name},
                ${team2ID},
                ${team2?.metadata.avatar},
                ${team2?.metadata.team_name},
                ${winnerID},
                ${loserID}
            )
            ON CONFLICT (season, league_id, bracket, round, matchup_id)
            DO UPDATE SET
                team1_user_id = EXCLUDED.team1_user_id,
                team1_avatar = EXCLUDED.team1_avatar,
                team1_name = EXCLUDED.team1_name,
                team2_user_id = EXCLUDED.team2_user_id,
                team2_avatar = EXCLUDED.team2_avatar,
                team2_name = EXCLUDED.team2_name,
                winner_user_id = EXCLUDED.winner_user_id,
                loser_user_id = EXCLUDED.loser_user_id;
        `;
    }
}

export async function populateFantasyPlayoffs(league: any) {
    const leagueID = league.league_id;
    const season = Number(league.season);

    // rosters → roster_id → user_id
    const rosters = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`).then(r => r.json());

    const rosterToUser = buildRosterToUserMap(rosters);

    // get users for avatars
    const leagueUsers = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`).then((r) => r.json());

    // process both brackets
    await processBracket(leagueID, season, "winners", leagueUsers, rosterToUser);
    await processBracket(leagueID, season, "losers", leagueUsers, rosterToUser);

    console.log(`✅ Finished importing playoff brackets for ${season}`);
}
