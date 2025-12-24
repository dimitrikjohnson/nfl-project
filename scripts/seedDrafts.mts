import { populateFantasyDrafts } from "../db/fantasy_drafts.mts";

// seed the fantasy_drafts table in the database by running the following command:
// npm run seed:drafts <LEAGUE_ID>

// Get league ID (CLI -> ENV)
const cliLeagueID = process.argv[2];
const envLeagueID = process.env.ALBINOSKIES_ID!;
const LEAGUE_ID = cliLeagueID ?? envLeagueID;

// seed the fantasy tables in the database
export async function seed() {
    try {
        await populateFantasyDrafts(LEAGUE_ID);

        process.exit(0);
    } catch (err: any) {
        console.error("Error:", err?.message ?? err);
        // non-zero exit to detect failure
        process.exit(1);
    }
}

seed();
