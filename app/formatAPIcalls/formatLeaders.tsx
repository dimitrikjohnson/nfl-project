interface LeaderCategory {
    displayName: string;
    shortDisplayName: string;
    leaders: {
        value: number;
        displayValue: string;
        athlete: { $ref: string };
        team: { $ref: string };
    }[];
}

export default async function formatLeaders(season: string, seasonType: string, data: any, getLeadersOverview: boolean, getLeagueLeaders = false) {
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
    const output: [string, string, Record<string, any> | any[]] = [season, seasonType, getLeagueLeaders ? {} : []];

    for (const category of categories) {
        /*
         * an error is thrown if there is no leader for a category
         * this try/catch skips the problematic category entirely
         * example: no one on the team has recorded an interception yet
        */
        try {
            if (getLeagueLeaders) {
                (output[2] as Record<string, any>)[category.displayName] = await leagueLeaders(category);
            } 
            else {
                (output[2] as any[]).push(await teamLeaders(category));
            }
        }
        catch (error) { continue; }
    }
    
    return output;
}

async function teamLeaders(category: LeaderCategory) {
    // replace http with https to fix 'Blocked loading mixed active content' on production
    const url = (category.leaders[0].athlete.$ref).replace("http", "https");

    const athleteRes = await fetch(url, { method: "get" });
    if (!athleteRes.ok) throw new Error('Something went wrong');
            
    const athleteData = await athleteRes.json();
            
    // QB Rating needs displayValue, everything else can use value
    // toLocaleString adds a comma to numbers in the thousands
    return {
        statName: category.displayName,
        statValue: category.shortDisplayName == "RAT" ? category.leaders[0].displayValue : (category.leaders[0].value).toLocaleString('en-US'), 
        playerName: athleteData.displayName,
        playerHeadshot: athleteData.headshot.href,
        playerJersey: athleteData.jersey,
        playerPosition: athleteData.position.abbreviation
    }     
}

async function leagueLeaders(category: LeaderCategory) {
    let leaders = [];
    
    for (let count = 0; count < 3; count += 1) {
        // replace http with https to fix 'Blocked loading mixed active content' on production
        const url = (category.leaders[count].athlete.$ref).replace("http", "https");

        const athleteRes = await fetch(url, { method: "get" });
        if (!athleteRes.ok) throw new Error('Something went wrong');
            
        const athleteData = await athleteRes.json();
      
        const athleteTeamRes = await fetch(category.leaders[count].team.$ref, { method: "get" });
        let athleteTeam = await athleteTeamRes.json();
            
        // QB Rating needs displayValue, everything else can use value
        // toLocaleString adds a comma to numbers in the thousands
        leaders.push({
            statValue: category.shortDisplayName == "RAT" ? category.leaders[count].displayValue : (category.leaders[count].value).toLocaleString('en-US'), 
            playerName: athleteData.displayName,
            playerHeadshot: athleteData.headshot.href,
            playerJersey: athleteData.jersey,
            playerPosition: athleteData.position.abbreviation,
            playerTeamID: athleteTeam.id,
            playerTeamAbbreviation: athleteTeam.abbreviation,
            playerTeamName: athleteTeam.displayName,
            playerTeamLogo: athleteTeam.logos[0].href
        });
    }   
    return leaders;
}