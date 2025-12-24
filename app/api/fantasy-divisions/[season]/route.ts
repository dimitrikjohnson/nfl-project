import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(_req: NextRequest, context: { params: Promise<{ season: string }>}) {
    try {
        // `params` is a Promise and must be unwrapped with `await`
        const { season } = await context.params;

        // only return divisions for the specified season
        const divisions = await sql`
            SELECT *
            FROM fantasy_divisions
            WHERE season = ${season}
            ORDER BY division_id ASC;
        `;

        return NextResponse.json(divisions);
    } catch (err) {
        console.error("Error loading fantasy standings:", err);
        return NextResponse.json({ error: "Failed to load fantasy standings" }, { status: 500 });
    }
}
