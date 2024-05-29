import React from 'react';
import Image from "next/image";
import AFCLogo from '@/public/afc.svg';
import NFCLogo from '@/public/nfc.svg';
import allTeamsColors from '@/app/data/allTeamsColors.json';
import TeamSummary from '@/app/components/TeamSummary';

const SelectedTeam = async ({ params }: { params: { teamID: string } }) => {
	const res = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${params.teamID}`, {
    	method: "GET"
  	});

	const data = await res.json();
	const team = data.team;

	const teamLogo = team.shortDisplayName == "Giants" || "Jets" ? team.logos[1] : team.logos[0];
	const conference = team.groups.parent.id == 8 
		? { logo: AFCLogo, alt: "AFC Logo" } 
		: { logo: NFCLogo, alt: "NFC Logo" }
	;

	return (
		<section className="w-full">
			<div className="grid md:flex relative h-64 md:h-80 overflow-hidden items-center">
				<div className="absolute w-full h-full" style={{ backgroundColor: allTeamsColors[params.teamID].bgColor }}></div>
				<div className="md:flex relative w-full justify-between items-center md:mx-6 lg:mx-14 3xl:m-auto 3xl:max-w-[1700px]">
					<img className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" src={ teamLogo.href } alt={ `${team.displayName} logo` } />
					<div className="text-center" style={{ color: allTeamsColors[params.teamID].textColor }}>
                        <p className="font-protest uppercase text-3xl md:text-5xl mb-1">{ team.location }</p>
                        <p className="font-protest uppercase text-6xl md:text-8xl mb-2">{ team.name }</p>
                        <p className="font-rubik text-sm md:text-base font-semibold flex gap-1.5 justify-center">
							<TeamSummary team={ team } hasTrophy={ true } />
                        </p>
                    </div>
					<Image src={ conference.logo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt={ conference.alt } priority />
				</div>
				<div className="flex gap-7 relative justify-center md:hidden">
                    <img className="w-16" src={ teamLogo.href } alt={ `${team.displayName} logo` } />
                    <Image className="w-16" src={ conference.logo }  alt={ conference.alt } priority />
                </div>
			</div>
		</section>
	)
}

export default SelectedTeam
