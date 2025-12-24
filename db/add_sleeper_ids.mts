import { sql } from "./dbConnect.mts";

// add Sleeper IDs to players in the 'player' database table
export async function addSleeperIDs() {
    const sleeperPlayers = await fetch('https://api.sleeper.app/v1/players/nfl').then(res => res.json());

    for (const sleeperID in sleeperPlayers) {
        const p = sleeperPlayers[sleeperID];

        // 1. ESPN ID path (fast + safe)
        if (p.espn_id) {
            await sql`
                UPDATE player
                SET sleeper_id = ${sleeperID}
                WHERE sleeper_id IS NULL
                    AND id = ${p.espn_id}
            `;
            continue;
        }

        // 2. For players without espn_id, check for a match by comparing against other attributes
        const matches = await sql`
            SELECT id
            FROM player
            WHERE sleeper_id IS NULL
                AND full_name ILIKE ${p.full_name}
                AND position = ANY(${p.fantasy_positions})
                AND team_abbreviation = ${p.team}
        `;

        // A match could be wrong when checking against other attributes; log possible ambiguities  
        if (matches.length !== 1) {
            console.warn(
                `Ambiguous Sleeper match for ${p.full_name} (${p.fantasy_positions}, ${p.team})`,
                matches.map(m => m.id)
            );
            continue;
        }

        // 3. Targeted update — no redundancy
        await sql`
            UPDATE player
            SET sleeper_id = ${sleeperID}
            WHERE id = ${matches[0].id}
        `;
    }
}