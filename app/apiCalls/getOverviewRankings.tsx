import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getOverviewRankings( teamID ) {
    const currentSeason = await fetchCurrentSeason()

    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/" + currentSeason + "/types/2/teams/" + teamID + "/statistics", { method: "get" })
    const data = await res.json()

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team stats')
    }

    const categories = data.splits.categories

    return {
        ppg: categories[1].stats[30],
        ypg: categories[1].stats[39],
        passingYPG: categories[1].stats[22],
        rushingYPG: categories[2].stats[13],
        sacks: categories[4].stats[14],
        ints: categories[5].stats[0],
        takeaways: categories[10].stats[20]
    }
}