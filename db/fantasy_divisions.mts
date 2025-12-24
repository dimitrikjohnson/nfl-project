import { sql } from "./dbConnect.mts";

export async function populateFantasyDivisions(league: any) {
    const leagueID = league.league_id;

    const numOfDivisions = league.settings.divisions || 0;

    if (numOfDivisions === 0) {
        console.log("ℹ️  League has no divisions configured. Skipping fantasy_divisions population.");
        return;
    }

    const rows = [];

    for (let divisionID = 1; divisionID <= numOfDivisions; divisionID++) {
        console.log(`ℹ️  Inserting division ${divisionID} for league ${league.season}...`);
        const divisionStr = `division_${divisionID}`;
        
        rows.push({
            league_id: leagueID,
            division_id: divisionID,
            name: league.metadata[divisionStr],
            season: Number(league.season),
            avatar: league.metadata[`${divisionStr}_avatar`],
        });
    }
    
    for (const row of rows) {
        await sql`
            INSERT INTO fantasy_divisions (
                league_id,
                division_id,
                name,
                season,
                avatar
            )
            VALUES (
                ${row.league_id},
                ${row.division_id},
                ${row.name},
                ${row.season},
                ${row.avatar}
            )
            ON CONFLICT (league_id, division_id)
            DO UPDATE SET
                name = EXCLUDED.name,
                avatar = EXCLUDED.avatar;
        `;  
    }

    console.log(`✅ Finished populating fantasy_divisions for ${league.season}.`);
    return rows;
}