import { sql } from "./dbConnect.mts";

import realNamesJSON from "../app/data/albinoSkiesUserNames.json" assert { type: "json" };

async function getFantasySeasonOutcome(leagueID: string) {
    // fetch league object (contains winner roster ID)
    const league = await fetch(`https://api.sleeper.app/v1/league/${leagueID}`).then(
        res => res.json()
    );

    const season = league.season; // ← YEAR

    const winnerRosterID = Number(
        league.metadata.latest_league_winner_roster_id
    );

    // fetch all rosters
    const rosters = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`).then(
        res => res.json()
    );

    // fetch all users (mainly for the team names)
    const users = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`).then(res => res.json());

    const champion = await getChampion(rosters, winnerRosterID);
    const toilet = await getToiletLoser(rosters, leagueID);

    const realNames = realNamesJSON as Record<string, string>;

    // Final output
    return {
        season,
        champion: champion.roster
            ? {
                rosterID: winnerRosterID,
                userID: champion.roster.owner_id,
                name: realNames[champion.roster.owner_id] || champion.user?.display_name,
                avatar: findTeamData(users, champion.roster.owner_id).pfp, 

                teamName: findTeamData(users, champion.roster.owner_id).teamName, 
                record: formatRecord(champion.roster.settings),
            }
            : null,

        toiletBowlLoser: toilet.roster
            ? {
                rosterID: toilet.roster.roster_id,
                userID: toilet.roster.owner_id,
                name: realNames[toilet.roster.owner_id] || toilet.roster?.display_name,
                avatar: findTeamData(users, toilet.roster.owner_id).pfp,
           
                teamName: findTeamData(users, toilet.roster.owner_id).teamName, 
                record: formatRecord(toilet.roster.settings),
            }
            : null
    };
}

// Champion logic
async function getChampion(rosters: any, winnerRosterID: Number) {
    const roster = rosters.find(
        (res: any) => res.roster_id === winnerRosterID
    );
   
    const user = roster
        ? await fetch(`https://api.sleeper.app/v1/user/${roster.owner_id}`).then(res => res.json())
        : null
    ;

    return { roster, user };
}

// Toilet Bowl Loser Logic (💩 King)
async function getToiletLoser(rosters: any, leagueId: string) {
    const losersBracket = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/losers_bracket`).then(
        res => res.json()
    );

    // The final toilet bowl loser is the loser of the FINAL game
    const finalMatch = losersBracket[losersBracket.length - 1];
    const toiletBowlLoserRosterId = finalMatch?.l;

    const roster = rosters.find(
        (res: any) => res.roster_id === toiletBowlLoserRosterId
    );

    const user = roster
        ? await fetch(`https://api.sleeper.app/v1/user/${roster.owner_id}`).then(res => res.json())
        : null;

    return { roster, user };
}

// Points leader logic
async function getTopScorer(season: number) {
    const [row] = await sql`
        SELECT
            user_id,
            team_name,
            points_for,
            team_avatar
        FROM fantasy_standings
        WHERE season = ${season}
        ORDER BY points_for DESC
        LIMIT 1;
    `;

    return row;
}

function findTeamData(users: any, userID: string) {
    const user = users.find((user: any) => user.user_id == userID);
    return {
        teamName: user.metadata.team_name,
        pfp: user.metadata.avatar
    };
}

// Format record as "W–L" or "W–L–T"
function formatRecord(settings: any) {
    if (!settings) return null;
    const { wins, losses, ties } = settings;

    return ties > 0
        ? `${wins}-${losses}-${ties}`
        : `${wins}-${losses}`;
}

export async function populateFantasySeason(leagueID: string) {
    console.log(`ℹ️  Fetching Sleeper data for league ${leagueID}`);
    const outcome = await getFantasySeasonOutcome(leagueID);

    if (!outcome.champion || !outcome.toiletBowlLoser) {
        console.warn("⚠️  Champion or toilet bowl loser missing in outcome. Aborting DB write.");
        console.warn("Outcome:", outcome);
      
        process.exitCode = 2;
        throw new Error("Missing champion or toilet bowl loser data");
    };

    // optional: attempt to preserve previous_league_id by reading existing row
    const existing = await sql`SELECT previous_league_id FROM fantasy_seasons WHERE league_id = ${leagueID}`;
    const previousLeagueID = existing?.[0]?.previous_league_id ?? null;

    const topScorer = await getTopScorer(outcome.season);

    const result = await sql`
        INSERT INTO fantasy_seasons (
            league_id,
            season,
            previous_league_id,
            champion_user_id,
            champion_team_name,
            champion_avatar,
            champion_record,
            loser_user_id,
            loser_team_name,
            loser_avatar,
            loser_record,
            top_scorer_user_id,
            top_scorer_team_name,
            top_scorer_avatar,
            top_scorer_points
        )
        VALUES (
            ${leagueID},
            ${outcome.season},
            ${previousLeagueID},

            ${outcome.champion.userID},
            ${outcome.champion.teamName},
            ${outcome.champion.avatar},
            ${outcome.champion.record},

            ${outcome.toiletBowlLoser.userID},
            ${outcome.toiletBowlLoser.teamName},
            ${outcome.toiletBowlLoser.avatar},
            ${outcome.toiletBowlLoser.record},

            ${topScorer.user_id},
            ${topScorer.team_name},
            ${topScorer.team_avatar},
            ${topScorer.points_for}
        )
        ON CONFLICT (league_id)
        DO UPDATE SET
            season = EXCLUDED.season,
            previous_league_id = COALESCE(fantasy_seasons.previous_league_id, EXCLUDED.previous_league_id),
            champion_user_id = EXCLUDED.champion_user_id,
            champion_team_name = EXCLUDED.champion_team_name,
            champion_avatar = EXCLUDED.champion_avatar,
            champion_record = EXCLUDED.champion_record,
            loser_user_id = EXCLUDED.loser_user_id,
            loser_team_name = EXCLUDED.loser_team_name,
            loser_avatar = EXCLUDED.loser_avatar,
            loser_record = EXCLUDED.loser_record,
            top_scorer_user_id = EXCLUDED.top_scorer_user_id,
            top_scorer_team_name = EXCLUDED.top_scorer_team_name,
            top_scorer_avatar = EXCLUDED.top_scorer_avatar,
            top_scorer_points = EXCLUDED.top_scorer_points,
            updated_at = NOW()
        RETURNING *;
    `;

    // show first row
    console.log("✅ fantasy_seasons upserted.");
    return result?.[0] ?? result;
}
