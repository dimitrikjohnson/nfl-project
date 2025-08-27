import formatNews from "@/app/formatAPIcalls/formatNews";

async function getLeagueNews() {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=12");
    
    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to league news');

    const data = await res.json();
    return formatNews(data.articles);
}

async function getTeamNews(teamID: string) {
    const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?team=${teamID}`);
    
    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to team news');

    const data = await res.json();
    return formatNews(data.articles);
}

async function getPlayerNews(playerID: string) {
    const res = await fetch(`https://site.api.espn.com/apis/fantasy/v2/games/ffl/news/players?limit=12&playerId=${playerID}`);
    
    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to player news');

    const data = await res.json();
    return formatNews(data.feed);
}

export { getLeagueNews, getTeamNews, getPlayerNews }