'use client';
import { useState, useEffect, createContext } from 'react';
import getTeam from '../apiCalls/getTeam';
import formatTeamData from '@/app/formatAPIcalls/formatTeamData';
 
export const Team = createContext({});

export default function TeamProvider({ children, teamID }: { children: React.ReactNode, teamID: string }) {
    const [team, setTeam] = useState({});

    // run this function every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        getTeam({ teamID }).then(
            (res) => setTeam(formatTeamData(res))
        );
    }, [teamID]);

    return <Team.Provider value={ team }>{children}</Team.Provider>
}