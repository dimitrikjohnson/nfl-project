import 'client-only';
import { useState, useEffect } from 'react';
import getStats from '@/app/apiCalls/getStats';
import fetchCurrentSeason from "@/app/apiCalls/fetchCurrentSeason";
import getRankColor from '../helpers/getRankColor';

export default function Statistics({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("");
    const [statGroups, setStatGroups] = useState({});

    const getCurrentSeason = () => fetchCurrentSeason().then(
        (res) => setCurrentSeason(res)
    )

    const getTeamStats = () => getStats( teamID ).then(
        (res) => setStatGroups(res)
    )

    const displayStats = () => {
        return (
            <>
                { Object.keys(statGroups).map(group =>
                    <>
                        <tr key={ group } className="bg-[#282e37] border-b border-secondaryGrey/[.50]">
                            <th colSpan={ 4 } className="text-start py-2 px-2 md:px-3">{ group }</th>
                        </tr>
                        { statGroups[group].map(stat =>
                            <tr key={ group + "-" + stat.label } className="border-b border-secondaryGrey/[.50] last-of-type:border-0">
                                <td className="hidden md:inline-block text-start py-2 px-3">{ stat.label }</td>
                                <td className="md:hidden text-start py-2 px-2 md:px-3">{ stat.shortLabel }</td>
                                <td className="text-start py-2 px-2 md:px-3">{ stat.perGame ? stat.perGame : "N/A" }</td>
                                <td className="text-start py-2 px-2 md:px-3">{ stat.total }</td>
                                <td className="text-start py-2 px-2 md:px-3">
                                    <span className={ getRankColor(stat.rank, stat.reversedColors) }>{ stat.rankDisplay }</span>
                                </td>
                            </tr>
                        )}
                    </>
                )}
            </>
        )
    }

    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason();
    }, []);

    useEffect(() => {
        getTeamStats();
    }, [teamID]);

    return (
        <>
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } Statistics</h2>
            <div className="overflow-auto sm:overflow-visible">
                <table className="table-auto relative w-full text-nowrap font-rubik bg-sectionColor rounded-md">
                    <thead className="border-b border-secondaryGrey text-right sticky top-0">
                        <tr>
                            <th className="bg-sectionColor rounded-t-md"></th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor">Per Game</th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor">Total</th>
                            <th className="py-2.5 px-3 text-start bg-sectionColor rounded-t-md">Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        { displayStats() }
                    </tbody>
                </table>
            </div>
        </>
    )
}