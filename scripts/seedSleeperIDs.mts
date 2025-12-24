import { addSleeperIDs } from "../db/add_sleeper_ids.mts";

// seed the 'player' database rows with sleeper IDs for each player (where they're available) by running the following command:
// npm run seed:sleeperIDs

export async function seed() {
    try {
        await addSleeperIDs();
        
        process.exit(0);
    } catch (err: any) {
        console.error("Error:", err?.message ?? err);
        // non-zero exit to detect failure
        process.exit(1);
    }
}

seed();
