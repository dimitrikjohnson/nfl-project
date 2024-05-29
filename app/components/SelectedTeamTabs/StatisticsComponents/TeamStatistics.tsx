import 'client-only';
import { useState, useEffect, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getTeamStats from '@/app/apiCalls/getTeamStats';
import getRankColor from '../../../helpers/getRankColor';

export default function TeamStatistics({ teamID }) {
    const [statGroups, setStatGroups] = useState({});

    const getStats = () => getTeamStats( teamID ).then(
        (res) => setStatGroups(res)
    );

    const displayStats = () => {
        return (<>
            { Object.keys(statGroups).map(group =>
                <Fragment key={ group }>
                    <tr className="bg-altTableRow border-b border-secondaryGrey/[.50] group/row">
                        <th colSpan={ 4 } className="text-start py-2 px-2 md:px-3">
                            <span className="mr-1.5">{ group }</span>
                            <span className="inline-block md:hidden relative group/icon">
                                <FontAwesomeIcon className="text-lighterSecondaryGrey group-hover/icon:text-white" icon="fa-solid fa-circle-info" />
                                <legend className="invisible group-hover/icon:visible absolute bottom-10 group-first-of-type/row:-bottom-4 p-2.5 -left-16 group-first-of-type/row:left-7 bg-stone-900 rounded-md border border-secondaryGrey/[.50] w-auto after:content-[''] after:absolute after:-bottom-1 group-first-of-type/row:after:bottom-6 after:w-2 after:h-2 after:left-[67px] group-first-of-type/row:after:-left-1 after:rotate-45 after:bg-stone-900">
                                    { statGroups[group].map(stat =>
                                        <div key={ group + "-" + stat.label } className="pb-2 last-of-type:pb-0">
                                            <span>{ stat.shortLabel }</span> 
                                            <span className="font-normal"> = { stat.label }</span>
                                        </div>
                                    )}
                                </legend>
                            </span>
                        </th>
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
                </Fragment>
            )}
        </>)
    }

    useEffect(() => {
        getStats()
    }, [teamID]);

    return (
        <div className="overflow-x-auto sm:overflow-visible">
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
                    { displayStats() }
                </tbody>
            </table>
        </div> 
    )
}