export default async function formatLeaders(season, data, getLeadersOverview, getLeagueLeaders = false) {
    let categories;

    // the categories that will be displayed for team leaders vs. league leaders are different
    if (!getLeagueLeaders) {
        categories = [data.categories[3], data.categories[4], data.categories[5], data.categories[7]];
        
        // if getLeadersOverview is false send a few extra stat leaders; otherwise, only send the main ones
        if (!getLeadersOverview) {
            categories.push(data.categories[8], data.categories[6]);
            categories.splice(2, 0, data.categories[11]);
            categories.splice(4, 0, data.categories[13]);
        }
    }
    else {
        categories = [
            data.categories[0], data.categories[7], data.categories[8], data.categories[1], 
            data.categories[9], data.categories[10], data.categories[2], data.categories[11],
            data.categories[13], data.categories[3], data.categories[4], data.categories[6]
        ];
    }

    // season is for keeping track of the season that is being displayed
    const output = [season, []];

    for (const category of categories) {
        /*
         * an error is thrown if there is no leader for a category
         * this try/catch skips the problematic category entirely
         * example: no one on the team has recoreded an interception yet
        */
        try {
            const athleteRes = await fetch(category.leaders[0].athlete.$ref, { method: "get" });
            if (!athleteRes.ok) throw new Error('Something went wrong');
            
            const athleteData = await athleteRes.json();

            let athleteTeam;

            if (getLeagueLeaders) {
                const athleteTeamRes = await fetch(category.leaders[0].team.$ref, { method: "get" });
                athleteTeam = await athleteTeamRes.json();
            }

            output[1].push({
                statName: category.displayName,
                statValue: category.leaders[0].displayValue,
                playerName: athleteData.displayName,
                playerHeadshot: athleteData.headshot.href,
                playerJersey: athleteData.jersey,
                playerPosition: athleteData.position.abbreviation,
                playerTeamID: athleteTeam?.id,
                playerTeamAbbreviation: athleteTeam?.abbreviation,
                playerTeamName: athleteTeam?.displayName,
                playerTeamLogo: athleteTeam?.logos[0].href
            });    
        }
        catch (error) { continue; }
    }

    return output;
}