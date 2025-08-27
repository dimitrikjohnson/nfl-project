'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import getLeagueLeaders from '@/app/apiCalls/getLeagueLeaders';
import { PlayerStatLeader, StatLeaders } from '@/app/types/statLeaders';

export default function LeagueLeaders() {
    const [season, setSeason] = useState<string>();
    const [seasonType, setSeasonType] = useState<number|string>();
    const [categories, setCategories] = useState<StatLeaders>({});
    const [isLoading, setIsLoading] = useState(true);
    
    const getLeaders = () => (getLeagueLeaders()).then(
        (res) => {
            setIsLoading(false);
            setSeason(res[0]);
            setSeasonType(res[1]);
            
            if (!Array.isArray(res[2])) {
                setCategories(res[2]); 
            } 
            else {
                setCategories({}); 
            }
        }
    );

    function displayLeaders(heading: string, leaders: PlayerStatLeader[]) {
        const topLeader = leaders[0];

        return (
            <div className="flex justify-between">
                <div className="pb-2">
                    <p className="font-bold pb-3">{ heading }</p>
                    { leaders.map((leader) =>
                        <div 
                            className="flex gap-3.5 pb-1.5 text-sm first-of-type:text-base first-of-type:text-gold dark:first-of-type:text-gold-dark first-of-type:font-bold" 
                            key={ leader.statValue + leader.playerName }
                        >
                            <p className="w-10">{ leader.statValue }</p>
                            <Link 
                                href={ leader.playerLink }
                                className="hover:text-blue-800 dark:hover:text-cyan-400"     
                            >
                                { leader.playerName }
                            </Link>
                        </div>
                    )}    
                </div>
                <div className="relative w-32 shrink-0">
                    <img className="absolute bottom-0" src={ topLeader.playerHeadshot } title={ topLeader.playerName } alt={ topLeader.playerName } />
                    <img className="absolute w-8 md:w-10 top-6 right-0 opacity-75" src={ topLeader.playerTeamLogo } title={ topLeader.playerTeamName } alt={ topLeader.playerTeamName } />
                </div> 
            </div>
        )
    }

    useEffect(() => {
        getLeaders()
    }, []);

    return (
        <>
            { isLoading
                ? <div className="skeleton w-full h-36 mb-8"></div>
                : <div className="mb-12">
                    <h3 className="font-protest text-2xl lg:text-3xl pb-3">
                        { (seasonType == 4 || seasonType == 1) && 
                            <span className="mr-1.5">{ season }</span> 
                        }
                        <span>NFL Leaders</span>      
                    </h3>
                    <div className="font-rubik grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        { Object.keys(categories).map(stat =>
                            <div key={ stat } className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none px-3 pt-3 rounded-md">
                                { displayLeaders(stat, categories[stat]) }
                            </div>
                        )}
                    </div>
                </div>
            }
        </>  
    )
}