import { Suspense } from "react";
import Leaders from "@/app/components/Leaders";
import LastTwoGames from "@/app/teams/[teamName]/overview/components/LastTwoGames";
import NextTwoGames from "@/app/teams/[teamName]/overview/components/NextTwoGames";
import TeamRankings from "@/app/teams/[teamName]/overview/components/TeamRankings";
import Standings from "@/app/components/Standings";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import H3 from "@/app/components/H3";

export default async function OverviewTab({ params }: { params: Promise<{ teamName: string }>}) {
    const { teamName } = await params;
    
    const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;

	return (
		<>
			<h2 className="font-protest text-3xl lg:text-4xl uppercase pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark">Overview</h2>
			
			<Leaders teamName={ teamName } getLeadersOverview={ true } /> 
			 
			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<TeamRankings teamID={ teamID } />  
			</Suspense>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-y-12 gap-x-4 mb-12">
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
			</div>

			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<Standings teamID={ teamID } />  
			</Suspense>
		</>
  	)
}
