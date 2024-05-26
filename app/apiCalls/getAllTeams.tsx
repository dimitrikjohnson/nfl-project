async function getAllTeams() {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams", {
        method: "GET"
    });

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch all teams data');

    const data = await res.json();
    const teams = data.sports[0].leagues[0].teams;
    const output = [];

    for (let team of teams) {
        const fetchTeamSeasonData = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${team.team.id}`, { method:'GET' });
        const teamSeasonData = await fetchTeamSeasonData.json();
        
        output.push({
            id: team.team.id,
            location: team.team.location,
            displayName: team.team.displayName,
            //color: team.team.color,
            //alternateColor: team.team.alternateColor,
            logo: (team.team.shortDisplayName == 'Giants' || 'Jets') ? team.team.logos[1].href : team.team.logos[0].href,
            record: teamSeasonData.team.record.items?.[0].summary,
            standingSummary: teamSeasonData.team.standingSummary && teamSeasonData.team.standingSummary
        })
    }

    //return teams
    return output;
}

export default getAllTeams