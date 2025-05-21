export default async function formatStandings(season, seasonType, data) {
    // season is for keeping track of the season that is being displayed
    const output = [season, seasonType, []];

    const standings = data.standings;
    //let position = 1;
    //console.log(standings)
    for (const team of standings) {
        const teamRes = await fetch(team.team.$ref, { method: "get" });
        const teamData = await teamRes.json();

        const teamRecords = team.records;

        output[2].push({
            id: teamData.id,
            name: teamData.name,
            abbreviation: teamData.abbreviation,
            logo: teamData.logos[0].href,
            record: teamRecords[0].displayValue,
            seed: teamRecords[0].stats.find(stat => stat.name == "playoffSeed").value,//position, //teamRecords[0].stats[10].displayValue,
            stats: getTeamStats(teamRecords[0].stats, teamRecords[1], teamRecords[2]),
            clinch: teamRecords[0].stats.find(stat => stat.name == "clincher")
        });

        //position += 1;
    }
    
    // sort the teams by playoff seed
    output[2].sort((a, b) => a.seed - b.seed);

    return output;
}

function getTeamStats(overallArr, homeArr, awayArr) {
    const stats = [];

    let winPercent = overallArr.find(stat => stat.name == "winPercent");
    let gamesBehind = overallArr.find(stat => stat.name == "gamesBehind");
    let pointDifferential = overallArr.find(stat => stat.name == "differential");
    let divisionRecord = overallArr.find(stat => stat.name == "divisionRecord");
    let streak = overallArr.find(stat => stat.name == "streak");
    /*
     * overallArr[3] = Points Per Game | overallArr[2] = Opponent Points Per Game
     * homeArr = Home Record | awayArr = Away Record | overallArr[20] = Division Record
     * overallArr[15] = Streak
    */
    let categories = [winPercent, gamesBehind, overallArr[3], overallArr[2], pointDifferential, homeArr, awayArr, divisionRecord, streak];
    
    for (const category of categories) {
        stats.push({
            heading: category.shortDisplayName,
            description: category.description,
            value: category.displayValue
        });
    }

    return stats;
}