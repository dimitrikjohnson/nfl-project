'use client';
import { useState, useEffect } from 'react';
import Leaders from '@/app/components/Leaders';
import PlayerTables from '@/app/teams/[teamName]/statistics/components/PlayerTables';
import getPlayerStats from '@/app/apiCalls/getPlayerStats';
import H3 from '@/app/components/H3';

export default function PlayerStatistics({ teamName, teamID }: { teamName: string; teamID: string }) {
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
            <Leaders teamName={ teamName } getLeadersOverview={ false } />
            <H3>
                { (seasonType == 4 || seasonType == 1) && 
                    <span className="mr-1.5">{ season }</span> 
                }
                <span>Player Statistics</span>    
            </H3>
            { isLoading
                ? <div className="skeleton w-full h-56"></div>
                : <PlayerTables statGroups={ statGroups } />
            }
        </>
    )
}