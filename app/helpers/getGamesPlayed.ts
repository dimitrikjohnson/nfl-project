// find "gamesPlayed" in the parameter sent
export default function getGamesPlayed(data: any) {
    /*
     * some players have the "games played" stat in different spots in their API response
     * this locates it no matter where it is
    */
    const gamesPlayed = data?.splits?.categories[0].stats.find(
        (stat: { name: string; }) => stat.name == "gamesPlayed"
    );

    return gamesPlayed?.displayValue || "0";
}