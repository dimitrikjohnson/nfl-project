import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, context: { params: Promise<{ season: string }>}) {
    try {
        const { searchParams } = new URL(_req.url);
        const queryType = searchParams.get("query") ?? "all";
        
        // `params` is a Promise and must be unwrapped with `await`
        const { season } = await context.params;

        if (queryType === "top3") {
            const result = await sql`
                WITH rounds AS (
                    SELECT
                        MAX(round) AS final_round,
                        MAX(round) - 1 AS semifinal_round
                    FROM fantasy_playoff_matchups
                    WHERE season = ${season}
                    AND bracket = 'winners'
                ),
                final_match AS (
                    SELECT
                        winner_user_id,
                        loser_user_id,

                        -- Champion avatar & name
                        CASE
                            WHEN winner_user_id = team1_user_id THEN team1_avatar
                            ELSE team2_avatar
                        END AS champion_avatar,
                        CASE
                            WHEN winner_user_id = team1_user_id THEN team1_name
                            ELSE team2_name
                        END AS champion_name,

                        -- Runner-up avatar & name
                        CASE
                            WHEN loser_user_id = team1_user_id THEN team1_avatar
                            ELSE team2_avatar
                        END AS runner_up_avatar,
                        CASE
                            WHEN loser_user_id = team1_user_id THEN team1_name
                            ELSE team2_name
                        END AS runner_up_name

                    FROM fantasy_playoff_matchups f
                    JOIN rounds r ON f.round = r.final_round
                    WHERE f.season = ${season}
                    AND f.bracket = 'winners'
                ),
                third_place_match AS (
                    SELECT
                        s.loser_user_id AS third_place_user_id,

                        -- Third place avatar & name
                        CASE
                            WHEN s.loser_user_id = s.team1_user_id THEN s.team1_avatar
                            ELSE s.team2_avatar
                        END AS third_place_avatar,
                        CASE
                            WHEN s.loser_user_id = s.team1_user_id THEN s.team1_name
                            ELSE s.team2_name
                        END AS third_place_name

                    FROM fantasy_playoff_matchups s
                    JOIN final_match f
                    ON s.winner_user_id = f.winner_user_id
                    JOIN rounds r
                    ON s.round = r.semifinal_round
                    WHERE s.season = ${season}
                    AND s.bracket = 'winners'
                )

                SELECT
                    f.winner_user_id      AS champion_user_id,
                    f.champion_avatar     AS champion_avatar,
                    f.champion_name       AS champion_name,

                    f.loser_user_id       AS runner_up_user_id,
                    f.runner_up_avatar    AS runner_up_avatar,
                    f.runner_up_name      AS runner_up_name,

                    t.third_place_user_id,
                    t.third_place_avatar,
                    t.third_place_name

                FROM final_match f
                CROSS JOIN third_place_match t;
            `;

            return NextResponse.json(result[0] ?? null);
        }

        // default: return winners and losers
        const winners = await sql`
            SELECT *
            FROM fantasy_playoff_matchups
            WHERE season = ${season} AND bracket = 'winners'
            ORDER BY round, matchup_id;
        `;

        const losers = await sql`
            SELECT *
            FROM fantasy_playoff_matchups
            WHERE season = ${season} AND bracket = 'losers'
            ORDER BY round, matchup_id;
        `;

        return NextResponse.json({
            winners: winners ?? null, 
            losers: losers ?? null
        });
    } catch (err) {
        console.error("Error loading fantasy playoff matchups:", err);
        return NextResponse.json({ error: "Failed to load fantasy playoff matchups" }, { status: 500 });
    }
}
