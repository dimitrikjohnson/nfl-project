import { populateFantasySeason } from "../db/fantasy_seasons.mts";
import { populateFantasyStandings } from "../db/fantasy_standings.mjs";
import { populateFantasyDivisions } from "../db/fantasy_divisions.mts";
import { populateFantasyPlayoffs } from "../db/fantasy_playoff_matchups.mts";

// seed the fantasy tables in the database by running the following command:
// npm run seed:fantasy <LEAGUE_ID>

// Get league ID (CLI -> ENV)
const cliLeagueID = process.argv[2];
const envLeagueID = process.env.ALBINOSKIES_ID!;
const LEAGUE_ID = cliLeagueID ?? envLeagueID;

// seed multiple fantasy tables in the database
export async function seed() {
    try {
        // fetch league object
        const league = await fetch(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`).then(res => res.json());

        await populateFantasySeason(LEAGUE_ID);
        
        await populateFantasyStandings(league);

        await populateFantasyDivisions(league);

        await populateFantasyPlayoffs(league);

        process.exit(0);
    } catch (err: any) {
        console.error("Error:", err?.message ?? err);
        // non-zero exit to detect failure
        process.exit(1);
    }
}

seed();
