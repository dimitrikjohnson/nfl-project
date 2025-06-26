'use client';
import { useState, useEffect } from 'react';
import Leaders from '@/app/components/Leaders';
import PlayerTables from '@/app/teams/[teamName]/@tabs/statistics/PlayerTables';
import getPlayerStats from '@/app/apiCalls/getPlayerStats';

export default function PlayerStatistics({ teamID }: { teamID: string }) {
    const [season, setSeason] = useState<string>();
    const [seasonType, setSeasonType] = useState<number|string>();
    const [statGroups, setStatGroups] = useState({});
    const [isLoading, setIsLoading] = useState(true); 

    const getStats = () => getPlayerStats(teamID).then(
        (res) => {
            setIsLoading(false);
            setSeason(res.season);
            setSeasonType(res.seasonType);
            setStatGroups(res.stats);  
        }
    );
    
    useEffect(() => {
        getStats()
    }, [teamID]);
    
    return (
        <>
            <Leaders teamID={ teamID } getLeadersOverview={ false } />
            <h3 className="font-protest text-2xl 2xl:text-3xl pb-3"> 
                { seasonType == 4 && 
                    <span className="mr-1.5">{ season }</span> 
                }
                <span>Player Statistics</span>     
            </h3>
            { isLoading
                ? <div className="skeleton w-full h-56"></div>
                : <PlayerTables statGroups={ statGroups } />
            }
        </>
    )
}