import { neon } from "@neondatabase/serverless";
import HistoryClient from "./HistoryClient";

const sql = neon(process.env.DATABASE_URL!);

export default async function HistoryHome() {
    const seasons = await sql`
        SELECT *
        FROM fantasy_seasons
        ORDER BY season DESC;
    `;

    return <HistoryClient seasons={seasons} />;
}
