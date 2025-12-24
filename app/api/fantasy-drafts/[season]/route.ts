import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, context: { params: Promise<{ season: string }>}) {
    try {
        const { season } = await context.params;
        
        const rows = await sql`
            SELECT
                -- fantasy_drafts table
                fd.draft_id,
                fd.draft_type,
                fd.league_id,
                fd.season,
                fd.round,
                fd.pick_number,
                fd.player_team,
                fd.user_id,
                fd.player_pool,

                -- player table
                p.id AS player_id,
                p.first_name,
                p.last_name,
                p.position,
                p.headshot_url,
                p.link,

                -- team table
                t.abbreviation AS defense_team,
                t.name AS defense_name,
                t.logo_url AS defense_logo,
                t.link AS defense_link


            FROM fantasy_drafts fd
            LEFT JOIN player p ON p.id = fd.player_id
            LEFT JOIN team t ON t.abbreviation =
                CASE fd.player_id
                    WHEN 'WAS' THEN 'WSH' 
                    ELSE fd.player_id
                END
            WHERE fd.season = ${season}
            ORDER BY fd.draft_id, fd.pick_number;
        `;

        const drafts: Record<string, any> = {};

        for (const row of rows) {
            if (!drafts[row.draft_id]) {
                drafts[row.draft_id] = {
                    draftID: row.draft_id,
                    leagueID: row.league_id,
                    draftType: row.draft_type,
                    season: row.season,
                    playerPool: row.player_pool,
                    users: [],
                    picks: []
                };
            }

            drafts[row.draft_id].picks.push({
                round: row.round,
                pickNumber: row.pick_number,
                userID: row.user_id,

                // player OR defense
                player: row.player_id
                    ? {
                        id: row.player_id,
                        firstName: row.first_name,
                        lastName: row.last_name,
                        position: row.position,
                        team: row.player_team,
                        headshot: row.headshot_url,
                        link: row.link
                    }
                    : null,

                defense: row.defense_team
                    ? {
                        team: row.defense_team,
                        name: row.defense_name,
                        logo: row.defense_logo,
                        link: row.defense_link
                    }
                    : null
            });
        }

        return NextResponse.json(drafts);
    } catch (err) {
        console.error("Error loading draft boards:", err);
        return NextResponse.json(
            { error: "Failed to load draft boards" },
            { status: 500 }
        );
    }
}

