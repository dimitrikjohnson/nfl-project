import { getTeamIDOrNotFound } from "@/app/helpers/routeGuards";
import Roster from "./Roster"

export default async function RosterTab({ params }: { params: Promise<{ teamName: string }> }) {
    const { teamName } = await params;
    getTeamIDOrNotFound(teamName); // show a 404 page for invalid team names
    return <Roster teamName={ teamName } />
}
  
