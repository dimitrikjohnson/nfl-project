'use client';
import { useState, useEffect } from 'react';
import getTeamStats from '@/app/apiCalls/getTeamStats';
import TeamTable from './TeamTable';

export default function TeamStatistics({ teamID }) {
    const [statGroups, setStatGroups] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const getStats = () => getTeamStats(teamID).then(
        (res) => {
            setIsLoading(false);
            setStatGroups(res);
        }
    );
    
    useEffect(() => {
        setIsLoading(true),
        getStats()
    }, [teamID]);
    
    return (<>
        { isLoading
            ? <div className="skeleton w-full h-56"></div>
            : <div className="overflow-x-auto sm:overflow-visible">
                <table className="table-auto relative w-full text-nowrap font-rubik bg-sectionColor rounded-md">
                    <thead className="border-b border-secondaryGrey text-right sticky top-0">
                        <tr>
                            <th className="bg-sectionColor rounded-tl-md"></th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor">Per Game</th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor">Total</th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor rounded-tr-md">Rank</th>
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