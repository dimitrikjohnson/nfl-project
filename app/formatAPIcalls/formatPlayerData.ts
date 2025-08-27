import { PlayerOverview } from "@/app/types/player";
import NFLLogo from '@/app/images/nflLogo.svg';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import formatPlayerStatsSummary from "./formatPlayerStatsSummary";

export default async function formatPlayerData(apiPlayerData: any): Promise<PlayerOverview> {
    const player  = apiPlayerData.athlete;
    
    const allTeamsColors = teamColors as AllTeamsColors;

    const onATeam = player.status.type != "inactive" && player.status.type != "free-agent";

    const injury = player.injuries?.[0];

    // determine if the player has an injury
    const injuryData = injury ? {
        status: injury.details.fantasyStatus.description,
        abbreviation: injury.type.abbreviation,
        type: injury.details.type,
        location: (injury.status != "Suspension" && injury.details.type != "Contract Dispute") && 
            !injury.details?.side 
                ? undefined 
                : injury.details?.side == "Not Specified" 
                    ? injury.details?.location 
                    : `${injury.details?.side} ${(injury.details?.location)?.toLowerCase()}`,
        detail: injury.details?.detail,
        returnDate: injury.details.returnDate,
        updateDate: injury.date,
        comment: injury.longComment
    }: undefined;

    return {
        id: player.id,
        name: player.displayName,
        firstName: player.firstName,
        lastName: player.lastName,
        position: {
            name: player.position.displayName,
            abbreviation: player.position.abbreviation
        },
        headshot: player.headshot?.href,
        jersey: player.displayJersey,
        height: player.displayHeight,
        weight: player.displayWeight,
        age: player.age,
        experience: player.displayExperience,
        college: player.college?.name ?? "Unknown",
        status: {                                  
            name: player.status.name,   // Active, Free Agent, Inactive, etc.
            type: player.status.type
        },
        onATeam: onATeam,
        team: {
            logo: onATeam ? player.team.logos[1].href : NFLLogo.src, // getting logos[1] should always get the logo for dark backgrounds
            longName: player.team.displayName,
            shortName: player.team.shortDisplayName,
            bgColor: onATeam ? allTeamsColors[(player.team.shortDisplayName).toLowerCase()].bgColor : "#94a3b8",
            textColor: onATeam ? allTeamsColors[(player.team.shortDisplayName).toLowerCase()].textColor: "#172554",
            altColor: onATeam ? `#${player.team.alternateColor}` : "#172554"
        }, 
        draft: player.displayDraft ?? "Undrafted/Unavailable", // "Undrafted/Unavailable" if there's no draft info
        debutYear: player.debutYear,
        injury: injuryData,
        statsSummary: player.statsSummary?.statistics && await formatPlayerStatsSummary(player.statsSummary, player.id, player.position.abbreviation)
    }
}