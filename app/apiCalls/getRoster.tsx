import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getRoster( teamID ) {
    const currentSeason = await fetchCurrentSeason()

    const rosterRes = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/" + teamID + "/roster", { method: "get" })
    const depthRes = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/" + currentSeason + "/teams/" + teamID + "/depthcharts", { method: "get" })
    
    const rosterData = await rosterRes.json()
    const depthData = await depthRes.json() 
    
    // This will activate the closest `error.js` Error Boundary
    if ( !(depthRes.ok || rosterData.ok) ) { throw new Error('Failed to fetch the roster or depth chart') }

    // both API responses are broken up into offense, defense, and special teams
    const rosterSides = [rosterData.athletes[0], rosterData.athletes[1], rosterData.athletes[2]]
    const offense = depthData.items[2].positions
    const defense = depthData.items[0].positions
    const specialTeams = depthData.items[1].positions

    /* 
        manually add the offense to the array because I want them to be displayed in a specific order
        then, only try to add it to the array if the team has a fullback slot
        finally, add the rest of the offensive positions to the array
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

    let positionsAndPlayers = {}
    
    for (const position of positionsArr) {
        // the positions will be added to an object when we come across them in the loop
        positionsAndPlayers[position.position.displayName] = {}

        for (const player of position.athletes) {
            // slice the player ID out of the link
            const playerID = player.athlete.$ref.slice(player.athlete.$ref.indexOf("athletes/")+9, player.athlete.$ref.indexOf('?'))
            
            // call a different API than the one in the response for extra data
            const playerRes = await fetch("https://site.web.api.espn.com/apis/common/v3/sports/football/nfl/athletes/" + playerID, { method: "get" })
            const playerResToJson = await playerRes.json()
            const playerData = playerResToJson.athlete

            let playerValues = {
                name: playerData.displayName,
                jersey: playerData.displayJersey,
                age: playerData.age,
                weight: playerData.displayWeight,
                height: playerData.displayHeight,
                experience: playerData.displayExperience
            }

            try {
                playerValues.headshot = playerData.headshot.href
                playerValues.college = playerData.college.name
            }
            // if an error is thrown, add the value that is present
            catch (err) {
                if (playerData.headshot) {
                    playerValues.headshot = playerData.headshot.href  
                }
                if (playerData.college) {
                    playerValues.college = playerData.college.name
                }
            }
            
            // add the player data to the object
            positionsAndPlayers[position.position.displayName][player.rank] = { playerValues/*playerID: playerID*/ }
        }
    }
    /*
    for (const side of rosterSides) {
        for (const athlete of side.items) {

        }
    }
    */
    // the API response is broken up into offense, defense, special teams, and more
    /*
    const sidesOfBall = data.athletes
    
    for (const side of sidesOfBall) {
        // end for loop before it gets to players on injured reserve 
        if (side.position == 'injuredReserveOrOut') {
            break
        }

        // go through the list of players and put each player in their corresponding position array
        for (const player of side.items) {
            let playerValues = {
                playerName: player.displayName,
                playerJersey: player.jersey,
                playerAge: player.age,
                playerWeight: player.displayWeight,
                playerHeight: player.displayHeight,
                playerExperience: player.experience.years
            }
            // an error will be thrown if the player doesn't have a headshot or a college
            try {
                playerValues.playerHeadshot = player.headshot.href
                playerValues.playerCollege = player.college.name
            }
            // if an error is thrown, add the value that is present
            catch (err) {
                if (player.headshot) {
                    playerValues.playerHeadshot = player.headshot.href
                    
                }
                if (player.college) {
                    playerValues.playerCollege = player.college.name
                }
                //console.log("hello")
            }
            try {
                positions[player.position.displayName].push(playerValues)
            }
            catch(err) {
                console.log(player)
            }
        }
    }
    */

    // remove the positions that don't have any players (will most likely only be the fullback position)
    /*
    Object.keys(positionsAndPlayers).map(position => {
        if (positionsAndPlayers[position].length == 0) {
            delete positionsAndPlayers[position]
        }
    })
    */
    //console.log(positionsAndPlayers)
    
    return positionsAndPlayers
}