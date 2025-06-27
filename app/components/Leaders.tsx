'use client';
import { useEffect, useState } from 'react';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';
import Leader from '@/app/components/Leader';
import { PlayerStatLeader } from '@/app/types/statLeaders';

export default function Leaders({ teamID, getLeadersOverview }: { teamID: string, getLeadersOverview: boolean }) {
    const [season, setSeason] = useState<string>();
    const [seasonType, setSeasonType] = useState<number|string>();
    const [leaders, setLeaders] = useState<PlayerStatLeader[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
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
    }, [teamID]);
   
    return (
        <div className="mb-12">
			<h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                { seasonType == 4 && 
                    <span className="mr-1.5">{ season }</span> 
                }
                <span>Team Leaders</span>     
            </h3>
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