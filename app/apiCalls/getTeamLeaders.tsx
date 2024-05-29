import fetchCurrentSeason from "./getCurrentSeason";

export default async function getTeamLeaders( teamID, responseType ) {
    const currentSeason = await fetchCurrentSeason();

    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${currentSeason}/types/2/teams/${teamID}/leaders`, { method: "get" });
    const data = await res.json();

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team leaders');

    let categories = [data.categories[3], data.categories[4], data.categories[5], data.categories[7]];
    
    // if the response type is "detailed" send a few more stat leaders; otherwise, only send the main ones
    if (responseType == "detailed") {
        categories.push(data.categories[8], data.categories[6]);
        categories.splice(2, 0, data.categories[11]);
        categories.splice(4, 0, data.categories[13]);
    }

    const output = [];

    for (const category of categories) {
        const athleteRes = await fetch(category.leaders[0].athlete.$ref, { method: "get" });
        const athleteData = await athleteRes.json();

        output.push({
            statName: category.displayName,
            statValue: category.leaders[0].displayValue,
            playerName: athleteData.displayName,
            playerHeadshot: athleteData.headshot.href,
            playerJersey: athleteData.jersey,
            playerPosition: athleteData.position.abbreviation
        });
    }

    return output;
}