import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, context: { params: Promise<{ season: string }>}) {
    try {
        // `params` is a Promise and must be unwrapped with `await`
        const { season } = await context.params;

        // only return standings for the specified season
        const standings = await sql`
            SELECT *
            FROM fantasy_standings
            WHERE season = ${season}
            ORDER BY wins DESC, points_for DESC;
        `;

        return NextResponse.json(standings);
    } catch (err) {
        console.error("Error loading fantasy standings:", err);
        return NextResponse.json({ error: "Failed to load fantasy standings" }, { status: 500 });
    }
}
