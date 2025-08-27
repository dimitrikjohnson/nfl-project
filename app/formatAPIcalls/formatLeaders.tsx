import replaceHttp from "@/app/helpers/replaceHttp";

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

interface BasePlayerData {
    id: string;
    slug: string;
    displayName: string;
    headshot: { href: string };
    jersey: string;
    position: { abbreviation: string };
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
    const athleteData = await fetchPlayerData(category.leaders[0].athlete.$ref);
    
    return {
        statName: category.displayName,
        statValue: formatStatValue("RAT", category.leaders[0].displayValue, category.leaders[0].value), 
        ...formatPlayerBase(athleteData),
    }     
}

async function leagueLeaders(category: LeaderCategory) {
    let leaders = [];
    
    // only want to display 3 leaders per category
    for (let count = 0; count < 3; count += 1) {
        const athleteData = await fetchPlayerData(category.leaders[count].athlete.$ref);
        let athleteTeam;
        
        // get the leading player's team (player leading the stat category)
        if (count == 0) {
            const athleteTeamRes = await fetch (
                replaceHttp(category.leaders[count].team.$ref), 
                { method: "get" }
            );
            athleteTeam = await athleteTeamRes.json();    
        }
           
        leaders.push({
            statValue: formatStatValue(category.shortDisplayName, category.leaders[count].displayValue, category.leaders[count].value),
            ...formatPlayerBase(athleteData),
            playerTeamID: athleteTeam?.id,
            playerTeamAbbreviation: athleteTeam?.abbreviation,
            playerTeamName: athleteTeam?.displayName,
            playerTeamLogo: athleteTeam?.logos[0].href
        });
    }   
    return leaders;
}

// ------------ shared logic functions --------------

async function fetchPlayerData(url: string) {
    const res = await fetch(replaceHttp(url));
    if (!res.ok) throw new Error("Failed to fetch player");
    return res.json();
}

function formatPlayerBase(player: BasePlayerData) {
    return {
        playerName: player.displayName,
        playerLink: `/player/${player.slug}-${player.id}`,
        playerHeadshot: player.headshot.href,
        playerJersey: player.jersey,
        playerPosition: player.position.abbreviation
    }
}

// QB Rating needs displayValue, everything else can use value
// toLocaleString adds a comma to numbers in the thousands
function formatStatValue(shortName: string, displayValue: string, value: number) {
    return shortName === "RAT" ? displayValue : value.toLocaleString("en-US");
}