import fetchCurrentSeason from "./fetchCurrentSeason";

export default async function getTeamLeaders( teamID, responseType ) {
    const currentSeason = await fetchCurrentSeason()

    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/" + currentSeason + "/types/2/teams/" + teamID + "/leaders", { method: "get" })
    const data = await res.json()

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch team leaders')
    }

    var categories
    // if the response type is "detailed" send more stat leaders; otherwise, only send the main ones
    responseType == "detailed" ? categories = data.categories : categories = [data.categories[0], data.categories[1], data.categories[2], data.categories[7]]
    const output = []

    for (const category of categories) {
        const athleteRes = await fetch(category.leaders[0].athlete.$ref, { method: "get" })
        const athleteData = await athleteRes.json()

        output.push({
            statName: category.displayName,
            statValue: category.leaders[0].displayValue,
            playerName: athleteData.displayName,
            playerHeadshot: athleteData.headshot.href,
            playerJersey: athleteData.jersey,
            playerPosition: athleteData.position.abbreviation
        })
    }

    return output
}

//export default getTeamLeaders