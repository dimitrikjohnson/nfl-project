'use client';
import { useState, useEffect, Fragment } from 'react';
import { useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import getRoster from '@/app/apiCalls/getRoster';
import getTeam from '@/app/apiCalls/getTeam';
import FilterList from '@/app/components/FilterList';
import unslugifyQuery from '@/app/helpers/unslugifyQuery';
import { AllPlayers } from '@/app/types/roster';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";
import H2 from '@/app/components/H2';
import Link from 'next/link';

export default function Roster({ teamName }: { teamName: string }) {
    const [teamAltColor, setTeamAltColor] = useState("");
    const [roster, setRoster] = useState<AllPlayers>({});
    const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
    const [popupActive, setPopupActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // gets the 'players' query from the URL
    const searchParams = useSearchParams();
    const players = searchParams.get('players');

    const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;

    /*
     * the tags match the ones assigned to the positions
     * they allow the user to filter the roster results
    */
    const tags = ["all", "offense", "defense", "special teams", "fantasy"];

    const tableHeadings = ["Name", "Age", "Height", "Weight", "College", "Experience"];

    // establish the styling for the table cells
    const tableCellClasses = "text-start p-1.5 md:px-3";
    
    const getTeamRoster = () => getRoster(teamID).then(
        (res) => {
            setIsLoading(false);
            setRoster(res.allPlayers);
            setErrors(res.errors);
        }
    );
    
    const getTeamAltColor = () => getTeam({teamID}).then(
        (res) => setTeamAltColor(res.alternateColor)
    );
    
    const displayPositions = () => {
        return (<>
            <div className="mt-8 md:mt-0 bg-section border border-gray-300 dark:bg-section-dark dark:border-none rounded-md overflow-x-auto sm:overflow-visible">
                <table className="table-auto relative w-full text-nowrap">
                    <thead className="border-b border-secondaryGrey text-right">
                        <tr>
                            { tableHeadings.map(heading =>
                                <th 
                                    key={ heading } 
                                    className="py-2.5 px-1.5 md:px-3 text-start bg-section dark:bg-section-dark first-of-type:rounded-tl-md last-of-type:rounded-tr-md"
                                >
                                    { heading }
                                </th>
                            )}    
                        </tr>
                    </thead>
                    <tbody>
                        {["offense", "defense", "special teams"].map((tag) => {
                            const filteredPositions = Object.keys(roster).filter(
                                position => roster[position].tags.includes(tag) &&
                                            roster[position].tags.includes(unslugifyQuery(players || ""))
                            );

                            // Show an error row if a section is empty and has a corresponding error
                            if (filteredPositions.length === 0 && (
                                (tag === "offense" && errors.offenseUnavailable) ||
                                (tag === "defense" && errors.defenseUnavailable) ||
                                (tag === "special teams" && errors.specialTeamsUnavailable)
                            )) {
                                const errorMsg = {
                                    offense: "The offensive roster is unavailable right now.",
                                    defense: "The defensive roster is unavailable right now.",
                                    "special teams": "The Special Teams roster is unavailable right now."
                                }[tag];

                                return (
                                    <tr key={`error-${tag}`}>
                                        <td 
                                            colSpan={ tableHeadings.length } 
                                            className="text-red-500 dark:text-red-400 text-center p-3"
                                        >
                                            { errorMsg }
                                        </td>
                                    </tr>
                                );
                            }

                            // Otherwise, display the normal position rows
                            return filteredPositions.map(position => (
                                <Fragment key={position}>
                                    <tr className="bg-alt-table-row dark:bg-alt-table-row-dark border-b border-secondaryGrey/[.50]">
                                        <th colSpan={ tableHeadings.length } className="text-start py-2 px-2 md:px-3">
                                            { position }{ Object.keys(roster[position].players).length > 1 && "s" }
                                        </th>
                                    </tr>
                                    { displayPlayerRows(roster[position].players) }
                                </Fragment>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        </>)
    }
    
    // determine the suffix for the player's position on the depth chart & seasons in league
    const getOrdinal = (num: number) => {
        let ord = 'th';

        if (num % 10 == 1 && num % 100 != 11) { ord = 'st'; }
        else if (num % 10 == 2 && num % 100 != 12) { ord = 'nd'; }
        else if (num % 10 == 3 && num % 100 != 13) { ord = 'rd'; }

        return ord;
    }
    
    const displayPlayerRows = (position: AllPlayers["positionName"]["players"]) => {
        return ( <>
            { Object.keys(position).map(player => {
                const { playerValues } = position[player];

                return (
                    <tr key={ player } className="border-b border-gray-900/20 dark:border-secondaryGrey/[.50] last-of-type:border-0">
                        <td className={ "flex gap-1.5 md:gap-2.5 " + tableCellClasses }>
                            <Link href={ playerValues.link } className="w-14 relative rounded-sm shrink-0" style={{ background: '#' + teamAltColor }}>
                                <img 
                                    className="relative bottom-0 rounded-sm" 
                                    src={ playerValues.headshot } 
                                    alt={ playerValues.headshot.startsWith("/_") ? "Default headshot" : playerValues.name } 
                                />
                            </Link>
                            <div className="flex gap-1.5 m-auto mx-0">
                                <Link className="text-blue-800 dark:text-cyan-400 hover:underline" href={ playerValues.link }>
                                    { playerValues.name }
                                </Link>
                                <p className="flex gap-1.5 text-gray-600 dark:text-lighterSecondaryGrey text-sm items-end">
                                    { playerValues.jersey &&
                                        <>
                                            <span>#{ playerValues.jersey }</span>
                                            <span>&#183;</span>
                                        </>
                                    }                                 
                                    <span>
                                        { player == "1" 
                                            ? "Starter"
                                            : player + getOrdinal(Number(player)) + " string"
                                        }
                                    </span>
                                    { playerValues.injuries &&
                                        <>
                                            <span>&#183;</span>
                                            <span className="text-red-400">{ playerValues.injuries }</span>
                                        </> 
                                    }
                                </p>
                            </div>
                        </td>
                        <td className={ tableCellClasses }>{ playerValues.age }</td>
                        <td className={ tableCellClasses }>{ playerValues.height }</td>
                        <td className={ tableCellClasses }>{ playerValues.weight }</td>
                        <td className={ tableCellClasses }>{ playerValues.college }</td>
                        <td className={ tableCellClasses }>
                            { position[player].playerValues.experience == 0
                                ? "Rookie"
                                : <span>
                                    { playerValues.experience + getOrdinal(playerValues.experience) } season
                                </span>
                            }
                        </td>
                    </tr>
                )
            })}
        </>)
    }
 
    useEffect(() => {
        setIsLoading(true),
        getTeamRoster(),
        getTeamAltColor()
    }, [players]);

    return (
        <>
            <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2 border-primary dark:border-primary-dark">
                <H2>Current Roster</H2>
                <div className="flex">
                    <button 
                        tabIndex={0} 
                        role="button" 
                        className="flex md:hidden border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] btn h-10 min-h-10 rounded-md"
                        onClick={ () => setPopupActive(prevState => !prevState) }
                    >
                        <span>Filters</span>
                        <FontAwesomeIcon icon={faCaretDown} className="" />
                    </button>
                    <FilterList tags={ tags } teamName={ teamName } isMobile={ false } showTeamColors={ true } query={ "players" }/>
                </div>
            </div>    
            { isLoading 
              ? <div className="skeleton w-full h-56"></div>
              : <>  
                    { popupActive && <FilterList tags={ tags } teamName={ teamName } isMobile={ true } showTeamColors={ true } query={ "players" }/> } 
                    { displayPositions() }
                </>
            }
        </>
    )
}