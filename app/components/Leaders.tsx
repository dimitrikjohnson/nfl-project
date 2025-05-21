'use client';
import { useEffect, useState } from 'react';
import getTeamLeaders from '../apiCalls/getTeamLeaders';
import Leader from './Leader';

export default function Leaders({ teamID, getLeadersOverview }) {
    const [season, setSeason] = useState();
    const [seasonType, setSeasonType] = useState();
    const [leaders, setLeaders] = useState([]);
    
    const getLeaders = () => getTeamLeaders(teamID, getLeadersOverview).then(
        (res) => {
            setSeason(res[0]);
            setSeasonType(res[1]);
            setLeaders(res[2]);
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
                { leaders.map(stat =>
                    <Leader key={ stat.statName } stat={ stat } />
                )}
            </div>
		</div>   
    )
}