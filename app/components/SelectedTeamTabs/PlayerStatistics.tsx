import 'client-only';
import { useState, useEffect } from 'react';
import ReactLoading from "react-loading";
import TeamLeaders from './OverviewComponents/TeamLeaders';
import getPlayerStats from '@/app/apiCalls/getPlayerStats';

export default function PlayerStatistics({ teamID }) {
    const [statGroups, setStatGroups] = useState({});
    const [spinner, setSpinner] = useState(false);
    const tableCellFormat = "text-end py-2 px-2 md:px-3";

    const getStats = () => getPlayerStats( teamID ).then(
        (res) => {
            setSpinner(false);
            setStatGroups(res)
        }
    );

    const displayTables = () => {
        let cellKey = 0;
        return (
            <>
                { Object.keys(statGroups).map(group =>
                    <div key={ group } className="overflow-x-auto sm:overflow-visible mb-8 last-of-type:mb-0">
                        <table className="table-auto relative w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                            <thead className="border-b border-secondaryGrey text-right">
                                <tr>
                                    { Object.keys(statGroups[group].tableHeadings).map(heading =>
                                        <th key={ group + heading } title={ statGroups[group].tableHeadings[heading].title } className="py-2.5 px-3 text-end first-of-type:text-start">
                                            { statGroups[group].tableHeadings[heading].heading }
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                { statGroups[group].players.map(player =>
                                    <tr key={ player.name } className="odd:bg-altTableRow">
                                        <td className={ `flex gap-1.5 ${tableCellFormat}` }>
                                            <p>{ player.name }</p>
                                            <p className="flex gap-1.5 text-lighterSecondaryGrey text-sm items-end">
                                                <span>{ player.position }</span>
                                                { player.jersey &&
                                                    <>
                                                        <span>&#183;</span>
                                                        <span>#{ player.jersey }</span>  
                                                    </>
                                                }    
                                            </p>
                                        </td>
                                        { player.stats.map(stat =>
                                            <td key={ cellKey += 1 } className={ tableCellFormat }>
                                                { stat }
                                            </td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </> 
        )
    }

    useEffect(() => {
        setSpinner(true),
        getStats()
    }, [teamID]);

    return (
        <>
            <TeamLeaders teamID={ teamID } responseType={ "detailed" }/>
            <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">Player Statistics</h3>
            { spinner 
              ? <div className="w-full flex justify-center mt-5">
                    <ReactLoading type="spin" height={100} width={75} />
                </div> 
              : displayTables()
            }
        </>
    )
}