'use client';
import { useState, useEffect, createContext } from 'react';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
 
export const SuperBowlWinner = createContext(null);

export default function SuperBowlWinnerProvider({ children, }: { children: React.ReactNode }) {
    const [sbWinner, setSBWinner] = useState({});

    const getSBWinner = () => getSuperBowlWinner().then(
		(res) => {
			if (res) {
				setSBWinner({
					headline: res.headline, 
					winner: res.winnerID
				});
			}
		}
	);

    useEffect(() => {
		getSBWinner()
	}, []);

    return <SuperBowlWinner.Provider value={ sbWinner }>{children}</SuperBowlWinner.Provider>
}