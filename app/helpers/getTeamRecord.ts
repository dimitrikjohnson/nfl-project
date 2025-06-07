import getCurrentSeason from "@/app/helpers/getCurrentSeason";

export default async function getTeamRecord(teamID: string) {
    const currentSeasonData = await getCurrentSeason();
    const { year, type } = currentSeasonData;

    // if we're in the preseason, display the preseason record
    const seasonType = type === 1 ? 1 : 2;

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/${seasonType}/teams/${teamID}/record`, { 
        method: 'GET' 
    });
    const record = await res.json();

    return record.items[0].displayValue;
}