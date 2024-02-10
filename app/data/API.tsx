export async function getAllTeams() {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams", {
        method: "GET"
    })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    var data = await res.json()
    var teams = data.sports[0].leagues[0].teams
    return teams
    //return res.json()
}

//export { getAllTeams }