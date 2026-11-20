import { Suspense } from "react";
import Leaders from "@/app/components/Leaders";
import LastTwoGames from "@/app/teams/[teamName]/overview/components/LastTwoGames";
import NextTwoGames from "@/app/teams/[teamName]/overview/components/NextTwoGames";
import TeamRankings from "@/app/teams/[teamName]/overview/components/TeamRankings";
import Standings from "@/app/components/Standings";
import { getTeamIDOrNotFound } from "@/app/helpers/routeGuards";
import H3 from "@/app/components/H3";

export default async function OverviewTab({ params }: { params: Promise<{ teamName: string }>}) {
    const { teamName } = await params;
    const teamID = getTeamIDOrNotFound(teamName);

	return (
		<>
			<h2 className="font-protest text-3xl lg:text-4xl uppercase pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark">Overview</h2>
			
			<Leaders teamName={ teamName } getLeadersOverview={ true } /> 
			 
			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<TeamRankings teamID={ teamID } />  
			</Suspense>
			
			<section className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-4 mb-12">
				<div>
					<H3>Last Two Games</H3>
					<Suspense fallback={<div className="skeleton w-full h-24"></div>}>
						<LastTwoGames teamID={ teamID } />
					</Suspense>
				</div>
				<div className="flex flex-col">
					<H3>Next Two Games</H3>
					<Suspense fallback={<div className="skeleton w-full h-24"></div>}>
						<NextTwoGames teamID={ teamID } />
					</Suspense>
				</div>
			</section>

			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<Standings teamID={ teamID } />  
			</Suspense>
		</>
  	)
}
