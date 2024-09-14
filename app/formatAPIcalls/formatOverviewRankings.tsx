
export default function formatOverviewRankings( data ) {
    const categories = data.splits.categories;

    return {
        "Offensive": [
            getValues(categories[1].stats[30], "Points P/G"),
            getValues(categories[1].stats[39], "Yards P/G"),
            getValues(categories[1].stats[22], "Pass Yards P/G"),
            getValues(categories[2].stats[13], "Rush Yards P/G")
        ],
        "Defensive": [
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