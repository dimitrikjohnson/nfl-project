import { notFound } from "next/navigation";
import getPlayer, { PLAYER_NOT_FOUND } from "@/app/apiCalls/getPlayer";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

/*
 * These show a 404 page for URLs that don't match a real player or team, instead of crashing with a server error.
 * Next.js renders layouts and pages at the same time, so any server layout/page that reads the URL params should use these.
*/

// get the player ID from the slug (e.g. gets 1234 from 'josh-allen-1234')
export function getPlayerIDOrNotFound(playerSlug: string) {
    const playerID = playerSlug.substring(playerSlug.lastIndexOf('-')+1);
    if (!/^\d+$/.test(playerID)) notFound();
    return playerID;
}

// fetch the player, showing a 404 page if ESPN doesn't have a player with this ID
export async function getPlayerOrNotFound(playerID: string) {
    try {
        return await getPlayer({ playerID });
    } catch (err) {
        if (err instanceof Error && err.message === PLAYER_NOT_FOUND) notFound();
        throw err;
    }
}

// get the ESPN team ID from the team name in the URL (e.g. 'bills')
export function getTeamIDOrNotFound(teamName: string) {
    const team = (teamColors as AllTeamsColors)[teamName];
    if (!team) notFound();
    return team.id;
}
