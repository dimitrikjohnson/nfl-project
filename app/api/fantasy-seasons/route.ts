import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
    try {
        const seasons = await sql`
            SELECT *
            FROM fantasy_seasons
            ORDER BY season DESC;
        `;

        return NextResponse.json(seasons);
    } catch (err) {
        console.error("Error loading fantasy seasons:", err);
        return NextResponse.json({ error: "Failed to load fantasy seasons" }, { status: 500 });
    }
}
