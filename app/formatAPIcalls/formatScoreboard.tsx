export default async function formatScoreboard() {
    let res = await fetch('https://cdn.espn.com/core/nfl/scoreboard?xhr=1&limit=50', { method: "GET" });
    let fullRes = await res.json();

    const data = fullRes.content.sbData;
    const dateParams = fullRes.content.dateParams;

    // get the current week of the season; if playoffs, get the round name
    const weekNum = dateParams.seasontype == 3 ? fullRes.content.calendar[2].entries[dateParams.week-1].label : dateParams.week;

    // get the date range for the current week
    const weekDetail = fullRes.content.calendar[dateParams.seasontype-1].entries[dateParams.week-1].detail;

    const output = [weekNum, weekDetail, []];
    //const output = {
    //    week: week,
    //    games: []
    //};

    for (const game of data.events) {
        const status = game.status;
        const gameStatus = status.type.description == "In Progress" ? `Q${status.period} ${status.displayClock}` : status.type.shortDetail;

        const comp = game.competitions[0];

        output[2].push({
            id: game.id, // used in JSX as key
            date: game.date,
            network: comp.broadcast,
            state: status.type.state,
            status: gameStatus,
            downDistance: status.type.description == "In Progress" && comp.situation.downDistanceText,
            //downDistance: status.type.description == "In Progress" && comp.situation.shortDownDistanceText,
            //yardLine: status.type.description == "In Progress" && comp.situation.possessionText,
            possession: status.type.description == "In Progress" && comp.situation.possession,
            //awayTeam: comp.competitors[1],
            //homeTeam: comp.competitors[0],
            teams: [comp.competitors[1], comp.competitors[0]]
        });
    }

    return output;
}