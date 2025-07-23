import teamColors from "@/app/data/allTeamsColors.json";
import { AllTeamsColors } from "@/app/types/colors";

// Get a different stadium image on each page load
export default async function getLandingBackground() {
    /*
    * Get all teams' IDs
    * I figured getting the info from my JSON would be the most efficient way to do this because it doesn't require an API call
    */
    const allTeamsColors = teamColors as AllTeamsColors;

    /*
     * 1. Get all the object keys (aka team names)
     * 2. Generate a random index
     * 3. Get a random key (team) using the index
     * 4. Get the ID from that random team
     * 5. Use that random ID to get the venue image for that team
    */
    const keys = Object.keys(allTeamsColors);
    const randomIndex = Math.floor(Math.random() * keys.length);
    const randomTeam = keys[randomIndex];
    let randomID = allTeamsColors[randomTeam].id;

    // the Chargers (id 24) don't have a venue image in their API response. Therefore, if 24 is rolled, use 23 instead
    if (randomID == "24") { randomID = "23"}
    
    const res = await fetch(`https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/franchises/${randomID}`, {
        method: "GET"
    });

    // This will activate the closest `error.js` Error Boundary
    if (!res.ok) throw new Error('Failed to fetch team');

    const team = await res.json();
    const { venue } = team;

    const venueName = venue.fullName;

    /*
     * Get the first image in the response
     * It's typically not the interior image. If it is, use it
     * (also use the first image if the team is the Raiders; their API response isn't labeled correctly)
    */
    const firstVenueImage = venue.images[0].href;
    const venueInterior = (firstVenueImage.includes("interior") || team.id == "13") ? firstVenueImage : venue.images[1].href;

    return {
        venueName: venueName,
        venueImage: venueInterior
    }
}