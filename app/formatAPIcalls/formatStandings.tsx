import { StandingsData, TeamInStandings } from "@/app/types/standings";
import replaceHttp from "@/app/helpers/replaceHttp";

export default async function formatStandings(season: string, seasonType: number | string, data: { standings: StandingsData[] }) {
    // season is for keeping track of the season that is being displayed
    const output: [string, number | string, TeamInStandings[]] = [season, seasonType, []];
    const standings = data.standings;
    
    for (const team of standings) {
        const url = replaceHttp(team.team.$ref);
        const teamRes = await fetch(url, { method: "get" });
        const teamData = await teamRes.json();

        const teamRecords = team.records;

        output[2].push({
            id: teamData.id,
            name: teamData.name,
            shortDisplayName: teamData.shortDisplayName,
            abbreviation: teamData.abbreviation,
            logo: teamData.logos[0].href,
            record: teamRecords[0].displayValue,
            seed: teamRecords[0].stats.find((stat: { name: string; }) => stat.name == "playoffSeed").value,
            stats: getTeamStats(teamRecords[0].stats, teamRecords[1], teamRecords[2]),
            clinch: teamRecords[0].stats.find((stat: { name: string; }) => stat.name == "clincher")
        });
    }
    
    // sort the teams by playoff seed
    output[2].sort((a: { seed: number; }, b: { seed: number; }) => a.seed - b.seed);

    return output;
}

function getTeamStats(overallArr: any[], homeArr: any, awayArr: any) {
    const stats = [];

    let winPercent = overallArr.find((stat: { name: string; }) => stat.name == "winPercent");
    let gamesBehind = overallArr.find((stat: { name: string; }) => stat.name == "gamesBehind");
    let pointDifferential = overallArr.find((stat: { name: string; }) => stat.name == "differential");
    let divisionRecord = overallArr.find((stat: { name: string; }) => stat.name == "divisionRecord");
    let streak = overallArr.find((stat: { name: string; }) => stat.name == "streak");
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