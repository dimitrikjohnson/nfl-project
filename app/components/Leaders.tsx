'use client';
import { useEffect, useState } from 'react';
import getTeamLeaders from '@/app/apiCalls/getTeamLeaders';
import Leader from '@/app/components/Leader';
import { PlayerStatLeader } from '@/app/types/statLeaders';

export default function Leaders({ teamID, getLeadersOverview }: { teamID: string, getLeadersOverview: boolean }) {
    const [season, setSeason] = useState<string>();
    const [seasonType, setSeasonType] = useState<number|string>();
    const [leaders, setLeaders] = useState<PlayerStatLeader[]>([]);
    
    const getLeaders = () => getTeamLeaders(teamID, getLeadersOverview).then(
        (res) => {
            setSeason(res[0]);
            setSeasonType(res[1]);
            
            if (Array.isArray(res[2])) {
                setLeaders(res[2]);
            } 
            else {
                setLeaders([]);
            }
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
                { leaders.map((stat: PlayerStatLeader) =>
                    <Leader key={ stat.statName } stat={ stat } />
                )}
            </div>
		</div>   
    )
}