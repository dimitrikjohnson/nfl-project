import { Suspense } from "react";
import Leaders from "@/app/components/Leaders";
import TeamRankings from "@/app/components/TeamRankings";
import LastTwoGames from "@/app/components/LastTwoGames";
import NextTwoGames from "@/app/components/NextTwoGames";
import Standings from "@/app/components/Standings";
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

const Overview = ({ teamName }: { teamName: string }) => {
	const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;

	return (
		<>
			<h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2 border-primary dark:border-primary-dark">Overview</h2>
			
			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<Leaders teamID={ teamID } getLeadersOverview={ true } /> 
			</Suspense>
			 
			<Suspense fallback={<div className="skeleton w-full h-14"></div>}>
				<TeamRankings teamID={ teamID } />  
			</Suspense>
			
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
				<div>
					<h3 className="font-protest pb-3 text-2xl 2xl:text-3xl">Last Two Games</h3>
					<Suspense fallback={<div className="skeleton w-full h-24"></div>}>
						<LastTwoGames teamID={ teamID } />
					</Suspense>
				</div>
				<div className="flex flex-col">
					<h3 className="font-protest pb-3 text-2xl 2xl:text-3xl">Next Two Games</h3>
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

export default Overview;
