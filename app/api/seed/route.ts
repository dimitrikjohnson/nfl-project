'use server';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless'; 

const sql = neon(process.env.DATABASE_URL!);

interface Player {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    position: string;
    headshotUrl: string | null;
    link: string;
}

async function getTeams() {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams';
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch teams: ${res.statusText}`);
    const data = await res.json();

    // Extract relevant fields
    return data.sports[0].leagues[0].teams.map((wrapper: any) => {
        const { team } = wrapper;
        return {
            id: parseInt(team.id),
            name: team.displayName,
            abbreviation: team.abbreviation,
            logoUrl: team.logos?.[0]?.href ?? null,
            link: `/teams/${team.shortDisplayName.toLowerCase()}`
        };
    });
}

// loop through all team rosters to get all active players
async function getRosters(teams: { id: number; abbreviation: string }[]) {
    const rosters: Record<string, Player[]> = {};

    for (const team of teams) {
        const rosterUrl = `https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/teams/${team.id}/roster`;
        const res = await fetch(rosterUrl);
        
        if (!res.ok)
            throw new Error(`Failed to fetch roster for team ${team.id}: ${res.statusText}`);
        
        const data = await res.json();

        const teamPlayers: Player[] = [];

        for (const sideOfBall of data.athletes) {
            sideOfBall.items.map((player: any) => {
                teamPlayers.push({
                    id: parseInt(player.id),
                    firstName: player.firstName,
                    lastName: player.lastName,
                    fullName: player.fullName,
                    position: player.position?.abbreviation ?? '',
                    headshotUrl: player.headshot?.href ?? null,
                    link: `/player/${player.slug}-${player.id}`  
                });     
            });
        }

        rosters[team.abbreviation] = teamPlayers;
    }

  return rosters;
}

// seed the database with teams and players
async function seed() {
    const teams = await getTeams();

    // add teams; update any differences in data
    for (const team of teams) {
        await sql`
            INSERT INTO team (id, name, abbreviation, logo_url, link)
            VALUES (${team.id}, ${team.name}, ${team.abbreviation}, ${team.logoUrl}, ${team.link})
            ON CONFLICT (id) DO UPDATE 
            SET name = EXCLUDED.name,
                abbreviation = EXCLUDED.abbreviation,
                logo_url = EXCLUDED.logo_url,
                link = EXCLUDED.link;
        `;
    }

    const rosters = await getRosters(teams);

    let numPlayers = 0;
    
    // add players; update any differences in data
    for (const teamAbbreviation in rosters) {
        for (const player of rosters[teamAbbreviation]) {
            await sql`
                INSERT INTO player (id, first_name, last_name, full_name, position, headshot_url, link, team_abbreviation)
                VALUES (
                    ${player.id}, 
                    ${player.firstName}, 
                    ${player.lastName}, 
                    ${player.fullName}, 
                    ${player.position}, 
                    ${player.headshotUrl}, 
                    ${player.link},
                    ${teamAbbreviation}
                )
                ON CONFLICT (id) DO UPDATE 
                SET first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    full_name = EXCLUDED.full_name,
                    position = EXCLUDED.position,
                    headshot_url = EXCLUDED.headshot_url,
                    link = EXCLUDED.link,
                    team_abbreviation = EXCLUDED.team_abbreviation;
            `;
            numPlayers += 1;
        }
    };

    return { teamsSeeded: teams.length, playersSeeded: numPlayers };
}

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }

    try {
        const result = await seed();
        return NextResponse.json({ ok: true, ...result });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }
}