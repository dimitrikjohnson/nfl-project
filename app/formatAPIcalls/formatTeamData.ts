import { Team } from "@/app/types/team";
import getTeamRecord from "@/app/helpers/getTeamRecord";

export default function formatTeamData(apiTeamData: any, seasonData?: any): Team {
    const team = apiTeamData.team ?? apiTeamData;
    const fullSeasonData = seasonData ?? apiTeamData;
    
    return {
        id: team.id,
        location: team.location,
        name: team.name,
        displayName: team.displayName,
        shortDisplayName: team.shortDisplayName,
        abbreviation: team.abbreviation,
        alternateColor: team.alternateColor,
        logo: team.shortDisplayName === "Giants" || team.shortDisplayName === "Jets"
            ? team.logos?.[1]?.href
            : team.logos?.[0]?.href,
        logoWhite: team.shortDisplayName === "Jets" && team.logos?.[0]?.href, // Need both Jets logos for light and dark mode
        record: fullSeasonData.team?.record?.items?.[0]?.summary || getTeamRecord(team.id),
        standingSummary: fullSeasonData.team?.standingSummary || "",
        conference: team.groups?.parent?.name || "",
        division: team.groups?.id
    };
}
