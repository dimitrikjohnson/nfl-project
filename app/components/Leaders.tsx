'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';
import Leader from '@/app/components/Leader';
import { PlayerStatLeader } from '@/app/types/statLeaders';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

export default function Leaders({ teamName, getLeadersOverview }: { teamName: string, getLeadersOverview: boolean }) {
    const [season, setSeason] = useState<string>();
    const [seasonType, setSeasonType] = useState<number|string>();
    const [leaders, setLeaders] = useState<PlayerStatLeader[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;
    
    const getLeaders = () => getTeamLeaders(teamID, getLeadersOverview).then(
        (res) => {
            setSeason(res[0]);
            setSeasonType(res[1]);
            
            // need to check for array; error occurs if you don't
            setLeaders(Array.isArray(res[2]) ? res[2] : [])

            setIsLoading(false);
        }
    );

    useEffect(() => {
        getLeaders()
    }, [teamName]);
   
    return (
        <div className="mb-12">
			<div className="flex items-end justify-between pb-3">
                <h3 className="font-protest text-2xl lg:text-3xl">
                    { (seasonType == 4 || seasonType == 1) && 
                        <span className="mr-1.5">{ season }</span> 
                    }
                    <span>Team Leaders</span>     
                </h3>
                { getLeadersOverview &&
                    <Link
                        href={`/teams/${teamName}/statistics?stats=player-stats`} 
                        className="text-sm lg:text-base text-blue-800 dark:text-cyan-400 hover:underline"
                    >
                        More team leaders
                    </Link>
                }
            </div>
			<div className="font-rubik grid grid-cols-2 md:grid-cols-4 gap-4">
                { isLoading
                    ? Array.from({ length: getLeadersOverview ? 4 : 8 }).map((_, index) => 
                        <div key={ index } className="skeleton w-full h-36 md:h-56" />
                    )
                    : leaders.map((stat: PlayerStatLeader) => 
                        <Leader key={ stat.statName } stat={ stat } />
                    )
                }
            </div>
		</div>   
    )
}