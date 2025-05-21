'use client';
import { useEffect, useState } from 'react';
import getLeagueLeaders from '@/app/apiCalls/getLeagueLeaders';

export default function LeagueLeaders() {
    const [season, setSeason] = useState();
    const [seasonType, setSeasonType] = useState();
    const [categories, setCategories] = useState([]);
    
    const getLeaders = () => (getLeagueLeaders()).then(
        (res) => {
            setSeason(res[0]);
            setSeasonType(res[1]);
            setCategories(res[2]);
        }
    );

    function displayLeaders(heading, leaders) {
        return (
            <div className="flex justify-between">
                <div className="pb-2">
                    <p className="font-bold pb-3">{ heading }</p>
                    { leaders.map(leader =>
                        <div className="flex gap-3.5 pb-1.5 text-sm first-of-type:text-base first-of-type:text-gold first-of-type:font-bold" key={ leader.statValue + leader.playerName }>
                            <p className="w-10">{ leader.statValue }</p>
                            <p>{ leader.playerName }</p>
                        </div>
                    )}    
                </div>
                <div className="relative w-40 md:w-32 lg:w-32 shrink-0">
                    <img className="absolute bottom-0" src={ leaders[0].playerHeadshot } title={ leaders[0].playerName } alt={ leaders[0].playerName } />
                    <img className="absolute w-10 lg:top-6 right-0 opacity-75" src={ leaders[0].playerTeamLogo } title={ leaders[0].playerTeamName } alt={ leaders[0].playerTeamName } />
                </div> 
            </div>
        )
    }

    useEffect(() => {
        getLeaders()
    }, []);

    return (
        <div className="mb-12">
            <h3 className="font-protest text-2xl 2xl:text-3xl pb-3">
                { seasonType == 4 && 
                    <span className="mr-1.5">{ season }</span> 
                }
                <span>NFL Leaders</span>      
            </h3>
            <div className="font-rubik grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                { Object.keys(categories).map(stat =>
                    <div key={ stat } className="bg-sectionColor px-3 pt-3 rounded-md">
                        
                        { displayLeaders(stat, categories[stat]) }
                    </div>
                )}
            </div>
        </div>
    )
}