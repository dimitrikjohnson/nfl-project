'use client';
import { useState, useEffect } from 'react';
import Leaders from '@/app/components/Leaders';
import PlayerTables from './PlayerTables';
import getPlayerStats from '@/app/apiCalls/getPlayerStats';

export default function PlayerStatistics({ teamID }) {
    const [season, setSeason] = useState();
    const [statGroups, setStatGroups] = useState({});
    const [isLoading, setIsLoading] = useState(false); 

    const getStats = () => getPlayerStats(teamID).then(
        (res) => {
            setIsLoading(false);
            setSeason(res.season);
            setStatGroups(res.stats);  
        }
    );
    
    useEffect(() => {
        setIsLoading(true),
        getStats()
    }, [teamID]);
    
    return (
        <>
            <Leaders teamID={ teamID } getLeadersOverview={ false } />
            <h3 className="font-protest text-2xl 2xl:text-3xl pb-3"> 
                <span>Player Statistics</span>
                { season != null && 
                    <span className="ml-1.5">{ season }</span> 
                }
            </h3>
            { isLoading
                ? <div className="skeleton w-full h-56"></div>
                : <PlayerTables statGroups={ statGroups } />
            }
        </>
    )
}