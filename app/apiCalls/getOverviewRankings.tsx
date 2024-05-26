import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getOverviewRankings( teamID ) {
    const currentSeason = await fetchCurrentSeason();

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/statistics`, { method: "get" })
    const data = await res.json();

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team rankings');

    const categories = data.splits.categories;

    return {
        offense: [
            getValues(categories[1].stats[30], "Points P/G"),
            getValues(categories[1].stats[39], "Yards P/G"),
            getValues(categories[1].stats[22], "Pass Yards P/G"),
            getValues(categories[2].stats[13], "Rush Yards P/G")
        ],
        defense: [
            getValues(categories[4].stats[20]), // Tackles for Loss
            getValues(categories[4].stats[14]), // Sacks
            getValues(categories[5].stats[0]), // Interceptions
            getValues(categories[10].stats[20], "Takeaways")    
        ]
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