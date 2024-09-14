'use server';
import { cache } from 'react';

const getCurrentSeason = cache(async () => {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl", { method: "get" });
    const data = await res.json()
    return data.season.year
});

export default getCurrentSeason;