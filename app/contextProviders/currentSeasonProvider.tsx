'use client';
import { useState, useEffect, createContext } from 'react';
import getCurrentSeason from '../apiCalls/getCurrentSeason';
 
export const CurrentSeason = createContext(null);

export default function CurrentSeasonProvider({ children, }: { children: React.ReactNode }) {
    const [currentSeason, setCurrentSeason] = useState("");

    useEffect(() => {
		getCurrentSeason().then(
			res => setCurrentSeason(res)
		);
	}, []);

    return <CurrentSeason.Provider value={ currentSeason }>{children}</CurrentSeason.Provider>
}