/*
 * 'getPlayerProfile' and 'getPlayerStatsData' run for each player
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

    /*
     * some players have the "games played" stat in differnt spots in their API response
     * this locates it no matter where it is
    */
    const gamesPlayed = athleteStatsData.splits.categories[0].stats.find(stat => stat.name == "gamesPlayed");

    return {
        gamesPlayed: gamesPlayed.displayValue,
        otherStats: athleteStatsData.splits.categories[statNum].stats
    };
}

async function addPlayer(category, chosenStatNums, index, playerStatCategory) {
    const profileInfo = await getPlayerProfile(category, index);
    const statData = await getPlayerStatsData(category, index, playerStatCategory);

    let statDisplayValues = [statData.gamesPlayed];

    chosenStatNums.forEach((num) => 
        statDisplayValues.push(statData.otherStats[num].displayValue)
    );

    return {
        ...profileInfo,
        stats: statDisplayValues
    }
}

export default async function formatPlayerStats(displayedSeason, data) {
    const output = {
        season: displayedSeason,
        stats: {
            "Passing": {
                tableHeadings: [
                    { heading: "Passing", title: "Passing" },
                    { heading: "GP", title: "Games Played" },
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
                    { heading: "GP", title: "Games Played" },
                    { heading: "ATT", title: "Rush Attempts" },
                    { heading: "YDS", title: "Rushing Yards" },
                    { heading: "YDS/ATT", title: "Rushing Yards Per Attempt" },
                    { heading: "YDS/G", title: "Rushing Yards Per Game" },
                    { heading: "TD", title: "Rushing Touchdowns" },
                    { heading: "FUM", title: "Fumbles" },
                    { heading: "FUML", title: "Fumbles Lost" }
                ],
                players: []
            }, 
            "Receiving": {
                tableHeadings: [
                    { heading: "Receiving", title: "Receiving" },
                    { heading: "GP", title: "Games Played" },
                    { heading: "TAR", title: "Receiving Targets" },
                    { heading: "REC", title: "Receptions" },
                    { heading: "YDS", title: "Receiving Yards" },
                    { heading: "YDS/R", title: "Yards Per Reception" },
                    { heading: "YAC", title: "Yards After Catch" },
                    { heading: "YDS/G", title: "Receiving Yards Per Game" },
                    { heading: "TD", title: "Receiving Touchdowns" },
                    { heading: "FUM", title: "Fumbles" },
                    { heading: "FUML", title: "Fumbles Lost" }
                ],
                players: []
            }, 
            "Defense": {
                tableHeadings: [
                    { heading: "Defense", title: "Defense" },
                    { heading: "GP", title: "Games Played" },
                    { heading: "TACK", title: "Tackles" },
                    { heading: "TFL", title: "Tackles for Loss" },
                    { heading: "HIT", title: "QB Hits" },
                    { heading: "SACK", title: "QB Sacks" },
                    { heading: "FF", title: "Forced Fumbles" }, 
                    { heading: "FR", title: "Fumbles Recovered" },
                    { heading: "PDEF", title: "Passes Defended" },
                    { heading: "INT", title: "Interceptions" },
                    { heading: "TD", title: "Touchdowns" }
                ],
                players: []
            }
        }
    };  

    // get passing stats
    for (let index = 0; index < data.categories[3].leaders.length; index += 1) {
        // only show 5 or less players per section to limit amount of API calls
        if (index == 5) break;

        /*
         * 2 = Completions | 11 = Pass Attempts | 1 = Completion Percentage
         * 18 = Passing Yards | 21 = Passing Yards Per Game | 17 = Passing Touchdowns
         * 5 = Interceptions
        */
        const chosenStats = [2, 11, 1, 18, 21, 17, 5];

        output.stats["Passing"].players.push(await addPlayer(data.categories[3], chosenStats, index, 1));
    }
    
    // get rushing stats
    for (let index = 0; index < data.categories[4].leaders.length; index += 1) {
        // only show 5 or less players per section to limit amount of API calls
        if (index == 5) break;

        /*
         * 5 = Rushing Attempts | 11 = Rushing Yards | 27 = Rushing Yards Per Attempt
         * 12 = Rushing Yards Per Game | 10 = Rushing Touchdowns | 8 = Fumbles
         * 9 = Fumbles Lost
        */
        const chosenStats = [5, 11, 27, 12, 10, 8, 9];

        output.stats["Rushing"].players.push(await addPlayer(data.categories[4], chosenStats, index, 2));
    }

    // get receiving stats
    for (let index = 0; index < data.categories[5].leaders.length; index += 1) {
        // only show 7 or less players per section to limit amount of API calls
        if (index == 7) break;

        /*
         * 9 = Receiving Targets | 15 = Receptions | 11 = Receiving Yards
         * 28 = Yards Per Reception | 12 = Yards After Catch | 14 = Receiving Yards Per Game
         * 10 = Receiving Touchdowns | 7 = Fumbles | 8 = Fumbles Lost
        */
        const chosenStats = [9, 15, 11, 28, 12, 14, 10, 7, 8];
 
        output.stats["Receiving"].players.push(await addPlayer(data.categories[5], chosenStats, index, 3));
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
        const generalCategory = categories[0].stats;
        const interceptions = categories[2].stats[0].displayValue;
        const touchdowns = categories[3].stats[10].displayValue;

        //console.log(generalCategory)
        
        output.stats["Defense"].players.push({
            ...profileInfo,
            stats: [
                generalCategory[4].displayValue,
                defStats[23].displayValue, // Tackles
                defStats[20].displayValue, // Tackles for Loss
                defStats[12].displayValue, // QB Hits
                defStats[14].displayValue, // QB Sacks
                generalCategory[0].displayValue, // Forced Fumbles
                generalCategory[1].displayValue, // Fumbles Recovered
                defStats[11].displayValue, // Passes Defended
                interceptions, // Interceptions
                touchdowns // Touchdowns
            ]
        });
    }

    return output;
}