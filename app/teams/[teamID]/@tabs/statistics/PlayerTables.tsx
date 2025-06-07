import { PlayerStats, PlayerStatCategories } from "@/app/types/teamStats";

export default function PlayerTables({ statGroups }: { statGroups: PlayerStatCategories }) {
    const tableCellFormat = "text-end py-2 px-2 md:px-3";
   
    return (
        <>
            { Object.keys(statGroups).map(group =>
                <div key={ group } className="overflow-x-auto sm:overflow-visible mb-8 last-of-type:mb-0">
                    <table className="table-auto relative w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                        <thead className="border-b border-secondaryGrey text-right">
                            <tr>
                                { Object.keys(statGroups[group].tableHeadings).map(heading =>
                                    <th 
                                        key={ group + heading } 
                                        title={ statGroups[group].tableHeadings[heading].title } 
                                        className="py-2.5 px-3 text-end first-of-type:text-start"
                                    >
                                        { statGroups[group].tableHeadings[heading].heading }
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            { statGroups[group].players.map((player: PlayerStats) =>
                                <tr key={ player.name } className="odd:bg-altTableRow">
                                    <td className={ `flex gap-1.5 ${tableCellFormat}` }>
                                        <p>{ player.name }</p>
                                        <p className="flex gap-1.5 text-lighterSecondaryGrey text-sm items-end">
                                            <span>{ player.position }</span>
                                            { player.jersey &&
                                                <span>#{ player.jersey }</span>  
                                            }    
                                        </p>
                                    </td>
                                    { player.stats.map((stat, index) =>
                                        <td key={ index } className={ tableCellFormat }>
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