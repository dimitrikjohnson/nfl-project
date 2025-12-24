import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// this gets the most recent season with a draft
export async function GET() {
    try {
        const rows = await sql`
            SELECT DISTINCT season
            FROM fantasy_drafts
            WHERE season IS NOT NULL
            ORDER BY season DESC;
        `;

        const seasons = rows.map(r => r.season);

        return NextResponse.json({
            latestSeason: seasons[0] ?? null,
            seasons
        });
    } catch (err) {
        console.error("Error loading draft seasons:", err);
        return NextResponse.json(
            { error: "Failed to load draft seasons" },
            { status: 500 }
        );
    }
}
