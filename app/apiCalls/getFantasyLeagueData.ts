import formatFantasyLeagueData from "../formatAPIcalls/formatFantasyLeagueData";

export default async function getFantasyLeagueData(leagueID: string) {    
    const [usersRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueID}/users`)
    ]);
    const users = await usersRes.json();

    const league = (await fetch(`https://api.sleeper.app/v1/league/${leagueID}`).then(
        res => res.json())
    );

    let currentWeek = null;

    if (league.status != "complete")  {
        // get the current week of the fantasy season
        const currentWeekRes = await fetch("https://api.sleeper.app/v1/state/nfl");
        currentWeek = (await currentWeekRes.json()).week;
    }

    // Map roster IDs to users
    const rostersRes = await fetch(`https://api.sleeper.app/v1/league/${leagueID}/rosters`);
    const rosters = await rostersRes.json();

    return await formatFantasyLeagueData(league, users, currentWeek, rosters);
}
