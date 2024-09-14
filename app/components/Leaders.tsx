'use client';
import { useEffect, useState } from 'react';
import getTeamLeaders from '../apiCalls/getTeamLeaders';
import getLeagueLeaders from '../apiCalls/getLeagueLeaders';
import Leader from './Leader';

export default function Leaders({ teamID, getLeadersOverview, isLeagueLeader = false }) {
    const [season, setSeason] = useState();
    const [leaders, setLeaders] = useState([]);
    const [isLoading, setIsLoading] = useState(false); 
    
    const getLeaders = () => (isLeagueLeader ? getLeagueLeaders() : getTeamLeaders(teamID, getLeadersOverview)).then(
        (res) => {
            setIsLoading(false);
            setSeason(res[0]);
            setLeaders(res[1]);
        }
    );

    useEffect(() => {
        setIsLoading(true),
        getLeaders()
    }, [teamID]);

    return (
        <div className="mb-12">
			<h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                { isLeagueLeader ? <span>League Leaders</span> : <span>Team Leaders</span> }
                { season != null && 
                    <span className="ml-1.5">{ season }</span> 
                }
            </h3>
			<div className={ `font-rubik grid grid-cols-2 md:grid-cols-4 ${ isLeagueLeader ? "xl:grid-cols-6 gap-7" : "gap-4" }` }>
                { leaders.map(stat =>
                    isLoading 
                        ? <div key={ stat.statName } className="skeleton w-full h-40"></div> 
                        : <Leader key={ stat.statName } stat={ stat } isLeagueLeader={ isLeagueLeader } />
                )}
            </div>
		</div>   
    )
}