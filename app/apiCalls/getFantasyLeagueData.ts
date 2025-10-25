import formatFantasyLeagueData from "../formatAPIcalls/formatFantasyLeagueData";

export default async function getFantasyLeagueData() {
    const leagueId = "1192577981690269696";
    
    const [usersRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`)
    ]);
    const users = await usersRes.json();

    // get the current week of the fantasy season
    const currentWeekRes = await fetch("https://api.sleeper.app/v1/state/nfl");
    const currentWeek = (await currentWeekRes.json()).week;

    // Map roster IDs to users
    const rostersRes = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const rosters = await rostersRes.json();

    return await formatFantasyLeagueData(leagueId, users, currentWeek, rosters);
}
