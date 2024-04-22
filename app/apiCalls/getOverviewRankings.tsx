import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getOverviewRankings( teamID ) {
    const currentSeason = await fetchCurrentSeason();

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/statistics`, { method: "get" })
    const data = await res.json();

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team stats');
    }

    const categories = data.splits.categories;

    return {
        ppg: getValues(categories[1].stats[30], "Points P/G"),
        ypg: getValues(categories[1].stats[39], "Yards P/G"),
        passingYPG: getValues(categories[1].stats[22], "Pass Yards P/G"),
        rushingYPG: getValues(categories[2].stats[13], "Rush Yards P/G"),
        sacks: getValues(categories[4].stats[14]),
        ints: getValues(categories[5].stats[0]),
        takeaways: getValues(categories[10].stats[20])
    }
}

function getValues(category, shortName = category.displayName) {
    return {
        shortName: shortName,
        longName: category.displayName,
        rank: category.rank,
        rankDisplayValue: category.rankDisplayValue
    }
}