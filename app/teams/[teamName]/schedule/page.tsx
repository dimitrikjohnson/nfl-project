import { getTeamIDOrNotFound } from "@/app/helpers/routeGuards";
import Schedule from "./Schedule";
  
export default async function ScheduleTab({ params }: { params: Promise<{ teamName: string }>}) {
    const { teamName } = await params;
    getTeamIDOrNotFound(teamName); // show a 404 page for invalid team names
    return <Schedule teamName={ teamName } />
}
  