'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import { TeamInStandings } from "@/app/types/standings";
import getStandings from "@/app/apiCalls/getStandings";
import groupNumbersJson from "@/app/data/groupNumbers.json";

type Props = {
    season: string;
    seasonType: string | number;
    originalData: TeamInStandings[];
    originalGroupNum: string;
    teamID: string;
};

export default function ClientStandings({ season, seasonType, originalData, originalGroupNum, teamID }: Props) {
    const [groupNum, setGroupNum] = useState<string>(originalGroupNum);
    const [data, setData] = useState<TeamInStandings[]>(originalData);
    const [loading, setLoading] = useState(true);

    // tell TypeScript that groupNumbers can be indexed by any string (prevents error)
    const groupNumbers: Record<string, string> = groupNumbersJson;

    const loadStandings = async (group: string) => {
        try {
            const res = await getStandings(group);
            setData(res[2]);
        } 
        catch (err) {
            console.error("Error loading standings", err);
        } 
        finally {
            setLoading(false);
        }
    };

    // handle the conference filters
    const handleGroupChange = (group: string) => {
        setGroupNum(group);
    };

    const headingClasses = "py-2.5 px-2 md:px-3 text-start";
    const bodyClasses = "py-2.5 px-2 md:py-2 md:px-3";

    const clinchValues = [
        { 
            value: "- *", 
            description: "Clinched Division and Bye"
        },
        { 
            value: "- z", 
            description: "Clinched Division"
        },
        { 
            value: "- y", 
            description: "Clinched Wild Card"
        },
        { 
            value: "- e", 
            description: "Eliminated from Playoff Contention"
        }
    ];

    function differentialColor(diff: string) {
        if (diff.startsWith("+")) { return "text-green-500" } 
        if (diff.startsWith("-")) { return "text-red-500" }
    }

    // re-load the data whenever the groupNum changes
    useEffect(() => {
        setLoading(true);
        loadStandings(groupNum);
    }, [groupNum]);

    return (
        <div>
            <div className="flex justify-between items-center pb-3">
                <h3 className="font-protest text-2xl lg:text-3xl">{ seasonType == 4 && season } { groupNumbers[groupNum] } Standings</h3>
                <div className={`flex gap-2.5 md:gap-3 ${ teamID != "" && "hidden" }`}>
                    { ["8", "7"].map(num =>
                       <button 
                            key={ num } 
                            className={`btn h-8 min-h-8 px-3.5 md:px-4 md:h-10 md:min-h-10 dark:border-none ${ groupNum == num 
                                ? "bg-primary text-primary-dark hover:bg-primary hover:text-primary-dark border-none \
                                    dark:bg-primary-dark dark:text-backdrop-dark dark:hover:bg-primary-dark dark:hover:text-backdrop-dark" 
                                : "bg-alt-table-row text-primary border border-gray-300 hover:bg-secondaryGrey/[0.25] \
                                    dark:border-none dark:bg-alt-table-row-dark dark:text-primary-dark" 
                            }`}
                            onClick={ () => handleGroupChange(num) }
                        >
                            { groupNumbers[num] }
                        </button> 
                    )}   
                </div>
            </div>
            <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto">
                { loading
                    ? <div className="skeleton w-full rounded-none h-80"></div>
                    : <table className="table-auto w-full text-nowrap font-rubik overflow-hidden border-b border-secondaryGrey">
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
                                <tr 
                                    key={ team.name } 
                                    className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark dark:border-none"
                                >
                                    <td className={ bodyClasses }>{ index + 1 }</td>
                                    <td className={ `flex gap-x-1 md:gap-x-2.5 items-center ${bodyClasses}` }>
                                        <img className="w-5 md:w-7" src={ team.logo } alt={ `${team.name} logo` } />
                                        <span className="flex gap-x-1 md:gap-x-1.5 mr-3 md:mr-0">
                                            { team.id == teamID 
                                                ? <>
                                                    <span className="inline-block md:hidden">{ team.abbreviation }</span>
                                                    <span className="hidden md:inline-block">{ team.name }</span>
                                                </>
                                                : <Link 
                                                    href={ `/teams/${ team.shortDisplayName.toLowerCase() }` } 
                                                    className="hover:text-cyan-500 dark:hover:text-cyan-400" 
                                                    title={ team.name }
                                                  >
                                                        <span className="inline-block md:hidden">{ team.abbreviation }</span>
                                                        <span className="hidden md:inline-block">{ team.name }</span>
                                                </Link>
                                            }
                                            { team.clinch 
                                                ? <span className="text-gray-600 dark:text-lighterSecondaryGrey">- { team.clinch?.displayValue }</span>
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
                }                  
                <div className="py-4 px-2 md:px-3 text-xs text-gray-600 dark:text-lighterSecondaryGrey">
                    <h3 className="uppercase font-bold mb-4">Legend</h3>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        <p>
                            <span className="uppercase font-bold">PS</span>: Playoff Seed
                        </p>
                        <p>
                            <span className="uppercase font-bold">W-L</span>: Win-Loss
                        </p>
                        { data[0].stats.map(stat =>
                            <p key={ stat.heading }>
                                <span className="font-bold">{ stat.heading }</span>: { stat.description }
                            </p>
                        )}
                        { clinchValues.map(clinch =>
                            <p key={ clinch.value }>
                                <span className="font-bold">{ clinch.value }</span>: { clinch.description }
                            </p>
                        )}
                    </div>
                </div>
            </div>      
        </div>
    )
}