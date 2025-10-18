
export default function formatOverviewRankings(season: string | number, seasonType: number, data: { splits: { categories: any; }; }) {
    const categories = data.splits.categories;
   
    return {
        "season": {
            year: season,
            type: seasonType
        },
        "sides": {
            "Offensive": [
                findStat(categories, 1, "totalPointsPerGame", "Points Per Game"),
                findStat(categories, 1, "yardsPerGame", "Yards Per Game"),
                findStat(categories, 1, "passingYardsPerGame", "Pass Yards Per Game"),
                findStat(categories, 2, "rushingYardsPerGame", "Rush Yards Per Game")
            ],
            "Defensive": [
                findStat(categories, 4, "tacklesForLoss"),
                findStat(categories, 4, "sacks"),
                findStat(categories, 5, "interceptions"),
                findStat(categories, 10, "totalTakeaways") 
            ]    
        }
    }
}

function findStat(categories: any, categoryNum: number, statName: string, shortName?: string) {
    const category = categories[categoryNum].stats.find(
        (stat: { name: string; }) => stat.name == statName
    );

    return {
        shortName: shortName ?? category.displayName,
        longName: category.displayName,
        value: category.displayValue,
        rank: category.rank,
        rankDisplayValue: category.rankDisplayValue
    }
}