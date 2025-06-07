import Image from "next/image";
import AFCLogo from '@/public/afc.svg';
import NFCLogo from '@/public/nfc.svg';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import TeamSummary from '@/app/components/TeamSummary';
import NavBar from "@/app/components/NavBar";
import getTeam from "@/app/apiCalls/getTeam";

const SelectedTeam = async ({ params }: { params: Promise<{ teamID: string }> }) => {
	const { teamID } = await params;
	const allTeamsColors = teamColors as AllTeamsColors;

	const team = await getTeam({ teamID });

	const conference = team.conference == "8" 
		? { logo: AFCLogo, alt: "AFC Logo" } 
		: { logo: NFCLogo, alt: "NFC Logo" }
	;

	return (
		<section className="w-full">
			<NavBar team={ team } />
			<div className="grid md:flex relative h-60 md:h-80 overflow-hidden items-center z-0">
				<div className="absolute w-full h-full" style={{ backgroundColor: allTeamsColors[teamID].bgColor }}></div>
				<div className="md:flex relative w-full justify-between items-center mt-16 md:mx-6 lg:mx-11">
					<img className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" src={ team.logo } alt={ `${team.displayName} logo` } />
					<div className="text-center" style={{ color: allTeamsColors[teamID].textColor }}>
                        <p className="font-protest uppercase text-3xl md:text-5xl mb-1">{ team.location }</p>
                        <p className="font-protest uppercase text-6xl md:text-8xl mb-2">{ team.name }</p>
                        <p className="font-rubik text-sm md:text-base font-semibold flex gap-1.5 justify-center">
							<TeamSummary team={ team } hasTrophy={ true } />
                        </p>
                    </div>
					<Image src={ conference.logo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt={ conference.alt } priority />
				</div>
			</div>	
		</section>
	)
}

export default SelectedTeam
