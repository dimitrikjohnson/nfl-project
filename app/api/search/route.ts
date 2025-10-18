import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless'; 

// get the connection string
const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() ?? '';

    // if there's no query, return empty arrays
    if (!q) return NextResponse.json({ teams: [], players: [] });

    const [players, teams] = await Promise.all([
        sql`
            SELECT id, full_name AS name, position, headshot_url, link, team_abbreviation
            FROM player
            WHERE full_name ILIKE ${'%' + q + '%'}
            ORDER BY full_name
            LIMIT 10
        `,
        sql`
            SELECT id, name, abbreviation, logo_url, link
            FROM team
            WHERE name ILIKE ${'%' + q + '%'}
                OR abbreviation ILIKE ${'%' + q + '%'}
            ORDER BY name
            LIMIT 10
        `
    ]);

    return NextResponse.json({
        players,
        teams
    });
}
