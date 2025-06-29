'use client';
import { useState, useEffect } from 'react';
import getTeamStats from '@/app/apiCalls/getTeamStats';
import TeamTable from '@/app/teams/[teamName]/statistics/components/TeamTable';

export default function TeamStatistics({ teamID }: { teamID: string }) {
    const [statGroups, setStatGroups] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getStats = () => getTeamStats(teamID).then(
        (res) => {
            setIsLoading(false);
            setStatGroups(res);
        }
    );
    
    useEffect(() => {
        getStats()
    }, [teamID]);
    
    return (<>
        { isLoading
            ? <div className="skeleton w-full h-56"></div>
            : <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto sm:overflow-visible">
                <table className="table-auto relative w-full text-nowrap font-rubik">
                    <thead className="border-b border-secondaryGrey text-right">
                        <tr>
                            <th></th>
                            <th className="py-2.5 px-3 text-start">Per Game</th>
                            <th className="py-2.5 px-3 text-start">Total</th>
                            <th className="py-2.5 px-3 text-start">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        <TeamTable statGroups={ statGroups } />
                    </tbody>
                </table>
            </div> 
        }
    </>)
}