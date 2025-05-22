import React, { cache } from "react";
import getStandings from "@/app/apiCalls/getStandings";
import groupNumbersJson from "@/app/data/groupNumbers.json";
import Link from "next/link";
import cacheTeam from "@/app/helpers/cacheTeam";

export const getTeam = cache(cacheTeam);

export default async function Standings({ groupNum = "", teamID = "" }) {
    // get the team id for their division standings
    if (teamID != "") {
        const team = await getTeam(teamID);
        groupNum = team.groups.id;
    }
    // tell TypeScript that groupNumbers can be indexed by any string (prevents error)
    const groupNumbers: Record<string, string> = groupNumbersJson;
 
    const standings = await getStandings(groupNum);
    const season = standings[0];
    const seasonType = standings[1];
    const data = standings[2];

    const headingClasses = "py-2.5 px-2 md:px-3 text-start";
    const bodyClasses = "py-2.5 px-2 md:py-2 md:px-3";

    function differentialColor(diff: string) {
        if (diff.startsWith("+")) { return "text-green-500" } 
        else if (diff.startsWith("-")) { return "text-red-500" }
    }

    return (
        <div className="mb-8">
            <h2 className="font-protest text-2xl 2xl:text-3xl pb-3">{ seasonType == 4 && season } { groupNumbers[groupNum] } Standings</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-nowrap font-rubik bg-sectionColor rounded-md overflow-hidden">
                    <thead className="border-b border-secondaryGrey">
                        <tr>
                            <th className={ headingClasses } title="Playoff Seed">PS</th>
                            <th className={ headingClasses }>TEAM</th>
                            <th className={ headingClasses }>W-L</th>
                            { data[0].stats.map(stat =>
                                <th key={ stat.heading } className={ headingClasses } title={ stat.description }>{ stat.heading }</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        { data.map((team, index) =>
                            <tr key={ team.name } className="odd:bg-altTableRow">
                                <td className={ bodyClasses }>{ index + 1 }</td>
                                <td className={ `flex gap-x-1 md:gap-x-2.5 items-center ${ bodyClasses }` }>
                                    <img className="w-5 md:w-7" src={ team.logo } alt={ `${ team.name } logo` } />
                                    <span className="flex gap-x-1 md:gap-x-1.5 mr-3 md:mr-0">
                                        { team.id == teamID 
                                            ? <>
                                                <span className="inline-block md:hidden">{ team.abbreviation }</span>
                                                <span className="hidden md:inline-block">{ team.name }</span>
                                            </>
                                            : <Link href={ `/teams/${ team.id }` } className="hover:text-cyan-400 hover:underline" title={ team.name }>
                                                <span className="inline-block md:hidden">{ team.abbreviation }</span>
                                                <span className="hidden md:inline-block">{ team.name }</span>
                                            </Link>
                                        }
                                        { team.clinch 
                                            ? <span className="text-lighterSecondaryGrey">- { team.clinch?.displayValue }</span>
                                            : null
                                        }    
                                    </span>
                                </td>
                                <td className={ bodyClasses }>{ team.record }</td>
                                { team.stats.map(stat =>
                                    <td 
                                        key={ team.id + stat.heading } 
                                        className={ `${ headingClasses } ${ stat.heading == "DIFF" && differentialColor(stat.value) }` }
                                    >
                                        { stat.value }
                                    </td>
                                )}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}