'use client';
import { useState, useEffect, Fragment } from 'react';
import getPlayerCareerStats from '@/app/apiCalls/getPlayerCareerStats';
import H2 from '@/app/components/H2';
import { Career, Headings } from '@/app/types/gameAndCareerStats';
import Link from "next/link";
import DefaultLogo from '@/app/images/default_logo.png';
import Image from "next/image";
import { displayTableFoot, displayTableHead, showStats, convertToNumber } from '@/app/helpers/gameAndCareerTables';
import FantasyTypeToggle from '@/app/components/FantasyTypeToggle';

export default function CareerStats({ playerID, playerSlug }: { playerID: string, playerSlug: string }) {
    const [fantasyType, setFantasyType] = useState<'half-ppr' | 'ppr'>('half-ppr');
    const [headings, setHeadings] = useState<Headings[]>([]);
    const [includesFantasyData, setIncludesFantasyData] = useState<boolean>();
    const [seasons, setSeasons] = useState<Career["seasons"]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getCareer = () => getPlayerCareerStats(playerID).then(
        (res) => { 
            // indicate that loading is finished by setting the loading to false
            setIsLoading(false);
            setHeadings(res.headings);
            setIncludesFantasyData(res.includesFantasyData);
            setSeasons(res.seasons);
        }
    );

    useEffect(() => {
        setIsLoading(true);
        getCareer();
    }, [playerID]);

    function displayTable() {
        const containerClasses = "flex gap-x-1.5 items-center";
        const tablePadding = "py-2.5 px-2 md:py-1.5 md:px-2.5";

        const { totals, averages } = calculateTotalsAndAverages(seasons, headings);

        return (
            <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto">
                <table className="table-auto w-full text-nowrap font-rubik overflow-hidden whitespace-nowrap">
                    { displayTableHead(headings, fantasyType) }
                    <tbody className="text-sm">
                        { seasons.map((season) => 
                            <Fragment key={ season.season }>
                                { season.statsOnTeam.map((team) =>
                                    <tr key={`${season.season}-${team.abbreviation}`} className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark dark:border-none">
                                        <td className={`text-start ${tablePadding}`}>
                                            <Link 
                                                href={`/player/${playerSlug}/games?season=${season.season}`} 
                                                className="text-blue-800 dark:text-cyan-400 group-hover:underline"
                                            >
                                                { season.season }
                                            </Link>                                             
                                        </td>
                                        <td className={`text-start ${containerClasses} ${tablePadding}`}>   
                                            <Link href={ team.link } className={`group ${containerClasses}`}>
                                                { team.logo
                                                    ? <img className="w-5 md:w-7" src={ team.logo } alt={`${team.displayName} logo`} />
                                                    : <Image className="w-4 md:w-6" src={ DefaultLogo } alt="Default logo" priority />
                                                }
                                                <span className="text-blue-800 dark:text-cyan-400 group-hover:underline">
                                                    <abbr title={ team.displayName } className="no-underline">{ team.abbreviation }</abbr>    
                                                </span>
                                            </Link>
                                        </td>
                                        <td  className={`text-start ${tablePadding}`}>   
                                            { team.gamesPlayed }
                                        </td>
                                        { showStats(headings, team.stats, tablePadding, fantasyType) }
                                    </tr>
                                )} 
                                { season.statsOnTeam.length > 1 &&                                    
                                    <tr className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row dark:odd:bg-alt-table-row-dark dark:border-none">
                                        <td className={`text-start ${tablePadding}`}>   
                                            { season.season }
                                        </td>
                                        <td className={`text-start ${tablePadding}`}>   
                                            TOTAL
                                        </td>
                                        <td className={`text-start ${tablePadding}`}>   
                                            { season.totalStats.gamesPlayed }
                                        </td>
                                        { showStats(headings, season.totalStats.stats, tablePadding, fantasyType) }
                                    </tr>
                                }      
                            </Fragment>
                        )}
                    </tbody>
                    { displayTableFoot({ totals, averages }, headings, fantasyType )}
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between mb-4 md:mb-9 pb-2 border-b-2 border-primary dark:border-primary-dark">
                <H2>Career Stats</H2>
                { (includesFantasyData && seasons.length > 0) &&
                    <FantasyTypeToggle
                        fantasyType={ fantasyType }
                        onChange={ setFantasyType }
                    />
                }
            </div>
            { isLoading 
              ? <div className="skeleton w-full h-56"></div>
              : seasons.length > 0
                    ? displayTable()
                    : <>
                        <p className="text-center font-bold text-lg mb-4">No game information available.</p>
                        <p className="text-center">This player has no regular season stats to display.</p>
                    </>     
            }               
        </>         
    )
}

function calculateTotalsAndAverages(seasons: Career["seasons"], headings: Headings[]) {
    // full column count (skip the first heading section)
    const fullColumnCount = headings
        .slice(1)
        .reduce((sum, heading) => sum + heading.columns.length, 0);

    const totals = Array(fullColumnCount).fill(0);
    const seasonCount = seasons.length;

    seasons.forEach(season => {
        let offset = 0;
        
        // calculate totals for each stat in the same order that the headings are listed in
        headings.slice(1).forEach(heading => {
            const len = heading.columns.length;
            const slice = season.totalStats.stats.slice(offset, offset + len);
            
            // add each total to the array and convert them to numbers
            for (let i = 0; i < len; i++) {
                totals[offset + i] += convertToNumber(slice[i]);
            }
            offset += len;
        });
    });

    const averages = totals.map(total => (total / seasonCount).toFixed(1));

    return { 
        totals: totals.map(total => total.toLocaleString()), 
        averages
    };
}
