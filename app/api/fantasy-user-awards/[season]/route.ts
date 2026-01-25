import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, context: { params: Promise<{ season: string }>}) {
    try {
        // `params` is a Promise and must be unwrapped with `await`
        const { season } = await context.params;

        const rows = await sql`
            SELECT
                fua.id,
                fua.user_id,
                fua.league_id,
                fua.season,
                fat.award_id,
                fat.award_name,
                fat.description,
                fat.award_icon
            FROM fantasy_user_awards fua
            INNER JOIN fantasy_award_types fat
                ON fua.award_id = fat.award_id
            WHERE fua.season = ${season}
                AND fat.award_category = 'Superlative'
            ORDER BY fat.award_name ASC
        `;

        return NextResponse.json(rows)
    } catch (err) {
        console.error("Error loading superlatives:", err);
        return NextResponse.json({ error: "Failed to load superlatives" }, { status: 500 });
    }
}