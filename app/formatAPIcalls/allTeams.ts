import formatTeamData from "@/app/formatAPIcalls/formatTeamData";

async function allTeams(data: { sports: { leagues: { teams: any; }[]; }[]; }) {
    const teams = data.sports[0].leagues[0].teams;
    const output = [];
    
    for (let team of teams) {
        const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${team.team.id}`, { method:'GET' });
        const teamSeasonData = await res.json();
       
        output.push(await formatTeamData(team, teamSeasonData))
    }

    return output;
}

export default allTeams