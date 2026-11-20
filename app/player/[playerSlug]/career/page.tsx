import { getPlayerIDOrNotFound } from "@/app/helpers/routeGuards";
import CareerStats from "./CareerStats";

export default async function CareerTab({ params }: { params: Promise<{ playerSlug: string }>}) {
    const { playerSlug } = await params;
    // get the player ID from the params (e.g. gets 1234 from 'josh-allen-1234'), or show a 404 page
    const playerID = getPlayerIDOrNotFound(playerSlug);
    
    return <CareerStats playerID={ playerID } playerSlug={ playerSlug } />
}