import fetchCurrentSeason from "./getCurrentSeason";
import { PlayerValues, AllPlayers, PartialPlayerInfo } from "@/app/types/roster";

export default async function getRoster( teamID: any ) {
    const currentSeason = await fetchCurrentSeason();

    const rosterLink = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/roster`;
    const depthLink = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/teams/${teamID}/depthcharts`;

    const rosterRes = await fetch(rosterLink, { method: "get" });
    const depthRes = await fetch(depthLink, { method: "get" });
    
    const rosterData = await rosterRes.json();
    const depthData = await depthRes.json();
    
    // This will activate the closest `error.js` Error Boundary
    if ( !(depthRes.ok || rosterRes.ok) ) { throw new Error('Failed to fetch the roster or depth chart') }

    // both API responses are broken up into offense, defense, and special teams
    const rosterSides = [rosterData.athletes[0], rosterData.athletes[1], rosterData.athletes[2]];
    const offense = depthData.items[2].positions;
    const defense = depthData.items[0].positions;
    const specialTeams = depthData.items[1].positions;

    /* 
     *   Manually add the offense to the array because I want them to be displayed in a specific order.
     *   Determine if the team has a fullback slot (some teams don't, so an error will be thrown 
     *   for some teams if the 'if' statement isn't present). Include tags for the filter on the Roster page.
     *   Finally, add the offensive line positions to the array.
    */
    let positionsArr = [
        { data: offense.qb, tags: ["fantasy"] },
        { data: offense.rb, tags: ["fantasy"] }
    ];
  
    if (offense.fb) {
        positionsArr.push({
            data: offense.fb,
            tags: ["fantasy"]
        });
    }

    positionsArr.push(
        { data: offense.wr, tags: ["fantasy"] },
        { data: offense.te, tags: ["fantasy"] }
    );

    const oLine = [offense.c, offense.lg, offense.lt, offense.rg, offense.rt];

    oLine.map(position =>
        positionsArr.push({ 
            data: position, 
            tags: [] 
        })
    );

    // add common tags to all offensive positions; did it this way to avoid repeating code
    for (const position of positionsArr) {
        position.tags.push("offense", "all");
    }

    const sidesOfBall = [defense, specialTeams];

    // add the defense and special teams to the array like this because I don't care what order the positions are displayed in
    for (const side of sidesOfBall) {
        for (const position in side) { 
            positionsArr.push({
                data: side[position],
                tags: side == defense ? ["defense", "all"] : ["special teams", "all"]
            }); 
        }
    }
    
    /*
     * partialPlayerInfo will hold the player ID, position, and rank of every player on the depth chart
     * allPlayers is for all player info that will be displayed on the page
    */
    let partialPlayerInfo: PartialPlayerInfo = {};

    let allPlayers: AllPlayers = {};
    
    for (const position of positionsArr) {
        // all positions will be added to the object when we come across each one in the loop
        allPlayers[position.data.position.displayName] = { players: {}, tags: position.tags };

        for (const player of position.data.athletes) {
            // slice the player ID out of the link
            const playerID = player.athlete.$ref.slice(player.athlete.$ref.indexOf("athletes/")+9, player.athlete.$ref.indexOf('?'));

           /*
            * determine if this player has already been added to the object
            * if he hasn't, create an array. if he has, push to the existing one
            * he may have because some players are listed under multiple positions
           */
            if (!partialPlayerInfo[playerID]) {
                partialPlayerInfo[playerID] = [{
                    position: position.data.position.displayName,
                    rank: player.rank
                }];
            }
            else {
                partialPlayerInfo[playerID].push({
                    position: position.data.position.displayName,
                    rank: player.rank
                });
            }
        }
    }

    /*
     * loop through offense, defense, and special teams
     * then, loop through all of the players in each section
    */
    for (const side of rosterSides) {
        for (const athlete of side.items) {
            // determine if the current athlete's ID is in the depth chart
            if (partialPlayerInfo.hasOwnProperty(athlete.id)) {               
                // set abbreviations for injury statuses
                let injuries = athlete.injuries[0]?.status;

                if (injuries == "Questionable") { injuries = "Q"; }
                else if (injuries == "Out") { injuries = "O"; }
                else if (injuries == "Doubtful") { injuries = "D"; }
                else if (injuries == "Suspension") { injuries = "SSPD"; }
                
                let playerValues: PlayerValues = {
                    name: athlete.displayName,
                    jersey: athlete.jersey,
                    age: athlete.age,
                    weight: athlete.displayWeight,
                    height: athlete.displayHeight,
                    experience: athlete.experience.years,
                    injuries: injuries,
                };
                
                // an error will be thrown if the player doesn't have a headshot or a college
                try {
                    playerValues.headshot = athlete.headshot.href;
                    playerValues.college = athlete.college.name;
                }
                // if an error is thrown, add the value that is present
                catch (err) {
                    if (athlete.headshot) {
                        playerValues.headshot = athlete.headshot.href; 
                    }
                    if (athlete.college) {
                        playerValues.college = athlete.college.name;
                    }
                }

                // go through this player object(s) and add them to the allPlayers object
                for (const object of partialPlayerInfo[athlete.id]) {
                    allPlayers[object.position]["players"][object.rank] = { playerValues };
                }
            }
        }
    }
        
    return allPlayers;
}