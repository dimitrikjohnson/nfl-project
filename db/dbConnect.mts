// connect to the database
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);