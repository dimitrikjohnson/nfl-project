import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getRoster( teamID ) {
    const currentSeason = await fetchCurrentSeason()

    const rosterLink = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamID}/roster`
    const depthLink = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/teams/${teamID}/depthcharts`

    const rosterRes = await fetch(rosterLink, { method: "get" })
    const depthRes = await fetch(depthLink, { method: "get" })
    
    const rosterData = await rosterRes.json()
    const depthData = await depthRes.json() 
    
    // This will activate the closest `error.js` Error Boundary
    if ( !(depthRes.ok || rosterRes.ok) ) { throw new Error('Failed to fetch the roster or depth chart') }

    // both API responses are broken up into offense, defense, and special teams
    const rosterSides = [rosterData.athletes[0], rosterData.athletes[1], rosterData.athletes[2]]
    const offense = depthData.items[2].positions
    const defense = depthData.items[0].positions
    const specialTeams = depthData.items[1].positions

    /* 
     *   Manually add the offense to the array because I want them to be displayed in a specific order.
     *   Then, determine if the team has a fullback slot (some teams don't, so an error will be thrown 
     *   for some teams without the check).
     *   Finally, add the rest of the offensive positions to the array.
    */
    let positionsArr = [offense.qb, offense.rb]

    offense.fb ? positionsArr.push(offense.fb) : null
    
    positionsArr.push(
        offense.wr,
        offense.te,
        offense.c,
        offense.lg,
        offense.lt,
        offense.rg,
        offense.rt
    )

    const sidesOfBall = [defense, specialTeams]

    // add the defense and special teams to the array like this because I don't care what order it's displayed in
    for (const side of sidesOfBall) {
        for (const position in side) {
            positionsArr.push(side[position])
        }
    }

    /*
     * partialPlayerInfo will hold the player ID, position, and rank of every player on the depth chart
     * allPlayers is for all player info that will be displayed on the page
    */
    let partialPlayerInfo = {}
    let allPlayers = {}
    
    for (const position of positionsArr) {
        // all positions will be added to the object when we come across each one in the loop
        allPlayers[position.position.displayName] = {}

        for (const player of position.athletes) {
            // slice the player ID out of the link
            const playerID = player.athlete.$ref.slice(player.athlete.$ref.indexOf("athletes/")+9, player.athlete.$ref.indexOf('?'))

           /*
            * determine if this player has already been added to the object
            * if he hasn't, create an array. if he has, push to the existing one
            * he may have because some players are listed under multiple positions
           */
            if (!partialPlayerInfo[playerID]) {
                partialPlayerInfo[playerID] = [{
                    position: position.position.displayName,
                    rank: player.rank
                }]
            }
            else {
                partialPlayerInfo[playerID].push({
                    position: position.position.displayName,
                    rank: player.rank
                })
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
                
                let playerValues = {
                    name: athlete.displayName,
                    jersey: athlete.jersey,
                    age: athlete.age,
                    weight: athlete.displayWeight,
                    height: athlete.displayHeight,
                    experience: athlete.experience.years
                }

                // an error will be thrown if the player doesn't have a headshot or a college
                try {
                    playerValues.headshot = athlete.headshot.href
                    playerValues.college = athlete.college.name
                }
                // if an error is thrown, add the value that is present
                catch (err) {
                    if (athlete.headshot) {
                        playerValues.headshot = athlete.headshot.href  
                    }
                    if (athlete.college) {
                        playerValues.college = athlete.college.name
                    }
                }

                // go through this player object(s) and add them to the allPlayers object
                for (const object of partialPlayerInfo[athlete.id]) {
                    allPlayers[object.position][object.rank] = { playerValues }
                }
            }
        }
    }

    // remove the positions that don't have any players  
    Object.keys(allPlayers).map(position => {
        if (Object.keys(allPlayers[position]).length == 0) {
            delete allPlayers[position]
        }
    })
        
    return allPlayers
}