import { sql } from "./dbConnect.mts";

type SleeperDraft = {
    draft_id: string;
    type: string;           // 'snake' or 'linear'
    season: string;
    status: string;
    draft_order: { ["id"]: number };
    settings: { 
        teams: number, 
        player_type: number 
    }
};

type SleeperPick = {
    draft_id: string;
    pick_no: number;
    round: number;
    picked_by: number;
    player_id: string;
    metadata: { team: string; }
};

export async function populateFantasyDrafts(leagueId: string) {
    // 1. Get drafts for league
    const drafts: SleeperDraft[] = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/drafts`).then(res => res.json());

    if (!drafts.length) {
        console.warn(`No drafts found for league ${leagueId}`);
        return;
    }

    for (const draft of drafts) {
        // ensure that the draft is complete and each team drafted players
        if ((draft.status != "complete") || (Object.keys(draft.draft_order).length != draft.settings.teams)) continue;

        const season = Number(draft.season);
        
        console.log(`ℹ️  Adding draft data for ${season}`);

        // determine whether it's a vets only or rookies only draft (leave null if it's a mix of both)
        let player_pool = null;
        if (draft.settings.player_type == 1) { player_pool = "Rookies"; }
        if (draft.settings.player_type == 2) { player_pool = "Veterans"; }

        // 2. Get picks for this draft
        const picks: SleeperPick[] = await fetch(`https://api.sleeper.app/v1/draft/${draft.draft_id}/picks`).then(res => res.json());

        if (!picks.length) continue;

        // regex expression to test if a string has letters
        const hasLetters = /[a-z]/i; 
        
        // 3. Insert draft pick (join via sleeper_id)
        for (const pick of picks) {
            
            // D/ST path
            if (hasLetters.test(pick.player_id)) {
                await sql`
                    INSERT INTO fantasy_drafts (
                        league_id,
                        draft_type,
                        player_pool,
                        draft_id, 
                        pick_number,
                        round,
                        user_id,
                        player_id,
                        season
                    )
                    VALUES (
                        ${leagueId},
                        ${draft.type},
                        ${player_pool},
                        ${pick.draft_id},
                        ${pick.pick_no},
                        ${pick.round},
                        ${pick.picked_by},
                        ${pick.player_id}, -- e.g. "DEN"
                        ${season}
                    )
                    ON CONFLICT (draft_id, pick_number) DO NOTHING
                `;
                continue;
            }

            // regular players path
            await sql`
                INSERT INTO fantasy_drafts (
                    league_id,
                    draft_type,
                    player_pool,
                    draft_id,
                    pick_number,
                    round,
                    user_id,
                    player_id,
                    player_team,
                    season
                )
                SELECT
                    ${leagueId},
                    ${draft.type},
                    ${player_pool},
                    ${pick.draft_id},
                    ${pick.pick_no},
                    ${pick.round},
                    ${pick.picked_by},
                    player.id,
                    ${pick.metadata.team == "" ? null : pick.metadata.team },
                    ${season}
                FROM player
                WHERE player.sleeper_id = ${pick.player_id}
                ON CONFLICT (draft_id, pick_number) 
                DO UPDATE SET
                    player_team = EXCLUDED.player_team,
                    player_pool = EXCLUDED.player_pool;
            `;
        }
        console.log(`✅ Finished adding draft data for ${season}.`);
    }
}
