import fetchCurrentSeason from "./fetchCurrentSeason";

/*
 * getPlayerProfile and getPlayerStatsData run for each player
 * they fetch profile info (name, jersey, position) and stats
*/
async function getPlayerProfile(category, currentIndex) {
    const athleteProfileRes = await fetch(category.leaders[currentIndex].athlete.$ref, { method: "get" });
    const athleteProfileData = await athleteProfileRes.json();

    return {
        name: athleteProfileData.displayName,
        jersey: athleteProfileData.jersey,
        position: athleteProfileData.position.abbreviation
    }
}

async function getPlayerStatsData(category, currentIndex, statNum) {
    const athleteStatsRes = await fetch(category.leaders[currentIndex].statistics.$ref, { method: "get" });
    const athleteStatsData = await athleteStatsRes.json();

    return athleteStatsData.splits.categories[statNum].stats;
}

export default async function getPlayerStats( teamID ) {
    const currentSeason = await fetchCurrentSeason();

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/leaders`, { method: "get" });
    const data = await res.json();

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team leaders');

    const output = {
        "Passing": {
            tableHeadings: [
                { heading: "Passing", title: "Passing" },
                { heading: "CMP", title: "Completions" },
                { heading: "ATT", title: "Pass Attempts" },
                { heading: "CMP%", title: "Completion Percentage" },
                { heading: "YDS", title: "Passing Yards" },
                { heading: "YDS/G", title: "Passing Yards Per Game" },
                { heading: "TD", title: "Passing Touchdowns" },
                { heading: "INT", title: "Interceptions" }
            ],
            players: []
        }, 
        "Rushing": {
            tableHeadings: [
                { heading: "Rushing", title: "Rushing" },
                { heading: "ATT", title: "Rush Attempts" },
                { heading: "YDS", title: "Rushing Yards" },
                { heading: "YDS/ATT", title: "Rushing Yards Per Attempt" },
                { heading: "YDS/G", title: "Rushing Yards Per Game" },
                { heading: "TD", title: "Rushing Touchdowns" },
                { heading: "FUM", title: "Fumbles" },
                { heading: "FUM L", title: "Fumbles Lost" }
            ],
            players: []
        }, 
        "Receiving": {
            tableHeadings: [
                { heading: "Receiving", title: "Receiving" },
                { heading: "TAR", title: "Receiving Targets" },
                { heading: "REC", title: "Receptions" },
                { heading: "YDS", title: "Receiving Yards" },
                { heading: "YDS/R", title: "Yards Per Reception" },
                { heading: "YAC", title: "Yards After Catch" },
                { heading: "YDS/G", title: "Receiving Yards Per Game" },
                { heading: "TD", title: "Receiving Touchdowns" },
                { heading: "FUM", title: "Fumbles" },
                { heading: "FUM L", title: "Fumbles Lost" }
            ],
            players: []
        }, 
        "Defense": {
            tableHeadings: [
                { heading: "Defense", title: "Defense" },
                { heading: "TACK", title: "Tackles" },
                { heading: "HUR", title: "QB Hurries" },
                { heading: "HIT", title: "QB Hits" },
                { heading: "SACK", title: "QB Sacks" },
                { heading: "TFL", title: "Tackles for Loss" },
                { heading: "BATD", title: "Passes Batted Down" },
                { heading: "PDEF", title: "Passes Defended" },
                { heading: "INT", title: "Interceptions" },
                { heading: "TD", title: "Touchdowns" }
            ],
            players: []
        }
    };

    // get receiving stats
    for (let index = 0; index < data.categories[3].leaders.length; index += 1) {
        // only show 5 or less players per section to limit amount of API calls
        if (index == 5) break;

        const profileInfo = await getPlayerProfile(data.categories[3], index);
        const passingStats = await getPlayerStatsData(data.categories[3], index, 1);

        output["Passing"].players.push({
            ...profileInfo,
            stats: [
                passingStats[2].displayValue, // Completions
                passingStats[11].displayValue, // Pass Attempts
                passingStats[1].displayValue, // Completion Percentage
                passingStats[18].displayValue, // Passing Yards
                passingStats[21].displayValue, // Passing Yards Per Game
                passingStats[17].displayValue, // Passing Touchdowns
                passingStats[5].displayValue // Interceptions
            ]
        });
    }

    // get rushing stats
    for (let index = 0; index < data.categories[4].leaders.length; index += 1) {
        // only show 5 or less players per section to limit amount of API calls
        if (index == 5) break;
        
        const profileInfo = await getPlayerProfile(data.categories[4], index);
        const rushingStats = await getPlayerStatsData(data.categories[4], index, 2);

        output["Rushing"].players.push({
            ...profileInfo,
            stats: [
                rushingStats[5].displayValue, // Rushing Attempts
                rushingStats[11].displayValue, // Rushing Yards
                rushingStats[27].displayValue, // Rushing Yards Per Attempt
                rushingStats[12].displayValue, // Rushing Yards Per Game
                rushingStats[10].displayValue, // Rushing Touchdowns
                rushingStats[8].displayValue, // Fumbles
                rushingStats[9].displayValue, // Fumbles Lost
            ]
        });
    }

    // get receiving stats
    for (let index = 0; index < data.categories[5].leaders.length; index += 1) {
        // only show 7 or less players per section to limit amount of API calls
        if (index == 7) break;
        
        const profileInfo = await getPlayerProfile(data.categories[5], index);
        const recStats = await getPlayerStatsData(data.categories[5], index, 3);

        output["Receiving"].players.push({
            ...profileInfo,
            stats: [
                recStats[9].displayValue, // Receiving Targets
                recStats[15].displayValue, // Receptions
                recStats[11].displayValue, // Receiving Yards
                recStats[28].displayValue, // Yards Per Reception
                recStats[12].displayValue, // Yards After Catch
                recStats[14].displayValue, // Receiving Yards Per Game
                recStats[10].displayValue, // Receiving Touchdowns
                recStats[7].displayValue, // Fumbles
                recStats[8].displayValue // Fumbles Lost
            ]
        });
    }

    // get defensive stats
    for (let index = 0; index < data.categories[6].leaders.length; index += 1) {
        // only show 7 or less players per section to limit amount of API calls
        if (index == 7) break;
        
        const profileInfo = await getPlayerProfile(data.categories[6], index);
        
        const athleteStatsRes = await fetch(data.categories[6].leaders[index].statistics.$ref, { method: "get" });
        const athleteStatsData = await athleteStatsRes.json();

        const categories = athleteStatsData.splits.categories;
                
        const defStats = categories[1].stats;
        const interceptions = categories[2].stats[0].displayValue;
        const touchdowns = categories[3].stats[10].displayValue;
        
        output["Defense"].players.push({
            ...profileInfo,
            stats: [
                defStats[23].displayValue, // Tackles
                defStats[6].displayValue, // QB Hurries
                defStats[12].displayValue, // QB Hits
                defStats[14].displayValue, // QB Sacks
                defStats[20].displayValue, // Tackles for Loss
                defStats[10].displayValue, // Passes Batted Down
                defStats[11].displayValue, // Passes Defended
                interceptions, // Interceptions
                touchdowns // Touchdowns
            ]
        });
    }

    return output;
}