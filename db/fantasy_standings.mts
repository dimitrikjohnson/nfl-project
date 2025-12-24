import { sql } from "./dbConnect.mts";

/**
 * Populates fantasy_standings for a single Sleeper league season.
 * @param leagueID Sleeper league ID (string)
 */
export async function populateFantasyStandings(league: any) {
    // 1) Get league ID
    const leagueID = league.league_id;
    const season = Number(league.season);

    console.log(`ℹ️  Loading standings for season ${season}`);

    // 2) Fetch rosters
    const rostersRes = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`);
    if (!rostersRes.ok) throw new Error("Failed to load rosters data");

    const rosters = await rostersRes.json();

    // 3) Fetch users (to resolve usernames + avatars)
    const usersRes = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`);
    if (!usersRes.ok) throw new Error("Failed to load users data");

    const users = await usersRes.json();

    const userMap = new Map();
    for (const u of users) {
        userMap.set(u.user_id, {
            username: u.display_name ?? "Unknown",
            avatar: u.metadata.avatar ?? null,
            teamName: u.metadata?.team_name || u.metadata?.nickname || u.display_name || "Team",
        });
    }

    // 4) Build standings rows
    const rows = rosters.map((roster: any) => {
        const user = userMap.get(roster.owner_id) || {};

        return {
            league_id: leagueID,
            season,
            roster_id: roster.roster_id,
            user_id: roster.owner_id,
            team_name: user.teamName,
            team_avatar: user.avatar,
            division_id: roster?.settings?.division || null,
            wins: roster.settings?.wins ?? 0,
            losses: roster.settings?.losses ?? 0,
            ties: roster.settings?.ties ?? 0,
            points_for: roster.settings?.fpts ? roster.settings.fpts + (roster.settings.fpts_decimal / 100) : 0,
            max_points_for: roster.settings?.ppts ? roster.settings.ppts + (roster.settings.ppts_decimal / 100) : 0,
            points_against: roster.settings?.fpts_against ? roster.settings.fpts_against + (roster.settings.fpts_against_decimal / 100) : 0,
        };
    });

    // 5) Write rows to database
    console.log(`ℹ️  Writing ${rows.length} standings rows to database...`);

    for (const row of rows) {
        await sql`
            INSERT INTO fantasy_standings (
                league_id,
                season,
                roster_id,
                user_id,
                team_name,
                team_avatar,
                division_id,
                wins,
                losses,
                ties,
                points_for,
                max_points_for,
                points_against
            )
            VALUES (
                ${row.league_id},
                ${row.season},
                ${row.roster_id},
                ${row.user_id},
                ${row.team_name},
                ${row.team_avatar},
                ${row.division_id},
                ${row.wins},
                ${row.losses},
                ${row.ties},
                ${row.points_for},
                ${row.max_points_for},
                ${row.points_against}
            )
            ON CONFLICT (league_id, roster_id)
            DO UPDATE SET
                season = EXCLUDED.season,
                user_id = EXCLUDED.user_id,
                team_name = EXCLUDED.team_name,
                team_avatar = EXCLUDED.team_avatar,
                division_id = EXCLUDED.division_id,
                wins = EXCLUDED.wins,
                losses = EXCLUDED.losses,
                ties = EXCLUDED.ties,
                points_for = EXCLUDED.points_for,
                max_points_for = EXCLUDED.max_points_for,
                points_against = EXCLUDED.points_against;
        `;
    }

    console.log(`✅ Standings saved for ${season}`);
    return { season, count: rows.length };
}