async function fetchCurrentSeason() {
    const res = await fetch("https://sports.core.api.espn.com/v2/sports/football/leagues/nfl", { method: "get" })

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch get current season')
    }
    
    var data = await res.json()
    return data.season.year
}

export default fetchCurrentSeason 