import { Team } from "@/app/types/team";
import getTeamRecord from "@/app/helpers/getTeamRecord";
import getTeamLogo from "../helpers/getTeamLogo";

export default async function formatTeamData(apiTeamData: any, seasonData?: any): Promise<Team> {
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
        logo: getTeamLogo(team),
        logoWhite: team.shortDisplayName === "Jets" && team.logos?.[0]?.href, // Need both Jets logos for light and dark mode
        record: fullSeasonData.team?.record?.items?.[0]?.summary || await getTeamRecord(team.id),
        standingSummary: fullSeasonData.team?.standingSummary || "",
        conference: team.groups?.parent?.id || "",
        division: team.groups?.id
    };
}
