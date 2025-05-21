
export default function formatOverviewRankings( season, seasonType, data ) {
    const categories = data.splits.categories;
   
    return {
        "season": {
            year: season,
            type: seasonType
        },
        "sides": {
            "Offensive": [
                getValues(categories[1].stats[30], "Points Per Game"),
                getValues(categories[1].stats[39], "Yards Per Game"),
                getValues(categories[1].stats[22], "Pass Yards Per Game"),
                getValues(categories[2].stats[13], "Rush Yards Per Game"),
            ],
            "Defensive": [
                getValues(categories[4].stats[20]), // Tackles for Loss
                getValues(categories[4].stats[14]), // Sacks
                getValues(categories[5].stats[0]), // Interceptions
                getValues(categories[10].stats[20], "Takeaways")    
            ]    
        }
    }
}

function getValues(category, shortName = category.displayName) {
    return {
        shortName: shortName,
        longName: category.displayName,
        value: category.displayValue,
        rank: category.rank,
        rankDisplayValue: category.rankDisplayValue
    }
}