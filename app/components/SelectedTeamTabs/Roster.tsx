import 'client-only';
import { useState, useEffect } from 'react';
import ReactLoading from "react-loading";
import Image from "next/image";
import DefaultHeadshot from '../../images/default_headshot.png';
import getRoster from '@/app/apiCalls/getRoster';
import getTeam from '@/app/apiCalls/getTeam';
import FilterList from '../FilterList';

export default function Roster({ teamID }) {
    const [teamAltColor, setTeamAltColor] = useState("");
    const [roster, setRoster] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [filter, setFilter] = useState("all");
    const [popupActive, setPopupActive] = useState(false);

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
            setSpinner(false);
            setRoster(res);
        }
    );
    
    const getTeamAltColor = () => getTeam({teamID}).then(
        (res) => setTeamAltColor(res.alternateColor)
    );

    const childToParent = (dataFromChild) => {
        setFilter(dataFromChild);
    }
    
    const displayPositions = () => {
        return (<>
            <div className="mt-8 md:mt-0 overflow-x-auto sm:overflow-visible">
                <table className="table-auto relative w-full text-nowrap font-rubik bg-sectionColor rounded-md">
                    <thead className="border-b border-secondaryGrey text-right sticky top-0 z-20">
                        <tr>
                            { tableHeadings.map(heading =>
                                <th key={ heading } className="py-2.5 px-1.5 md:px-3 text-start bg-sectionColor first-of-type:rounded-tl-md last-of-type:rounded-tr-md">{ heading }</th>
                            )}    
                        </tr>
                    </thead>
                    <tbody>
                        { Object.keys(roster).map(position =>
                            roster[position].tags.includes(filter) &&
                            <>
                                <tr key={ position } className="bg-[#282e37] border-b border-secondaryGrey/[.50]">
                                    <th colSpan={ tableHeadings.length } className="text-start py-2 px-2 md:px-3">
                                        { position }{ Object.keys(roster[position].players).length > 1 ? "s" : null }
                                    </th>
                                </tr>
                                { displayPlayerRows(roster[position].players) }
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </>)
    }
    
    // determine the suffix for the player's position on the depth chart & seasons in league
    const getOrdinal = (num) => {
        let ord = 'th';

        if (num % 10 == 1 && num % 100 != 11) { ord = 'st'; }
        else if (num % 10 == 2 && num % 100 != 12) { ord = 'nd'; }
        else if (num % 10 == 3 && num % 100 != 13) { ord = 'rd'; }

        return ord;
    }
    
    const displayPlayerRows = (position) => {
        return ( <>
            { Object.keys(position).map(player =>
                <tr key={ player } className="border-b border-secondaryGrey/[.50] last-of-type:border-0">
                    <td className={ "flex gap-1.5 md:gap-2.5 " + tableCellClasses }>
                        <div className="w-14 relative rounded-sm shrink-0 z-10" style={{ background: '#' + teamAltColor }}>
                            { position[player].playerValues.headshot
                              ? <img className="relative bottom-0" src={ position[player].playerValues.headshot } alt={ position[player].playerValues.name } />
                              : <Image className="w-14 object-cover rounded-sm" src={ DefaultHeadshot }  alt="Default profile picture" priority />
                            } 
                        </div>
                        <div className="flex gap-1.5 m-auto mx-0">
                            <p>{ position[player].playerValues.name }</p>
                            <p className="flex gap-1.5 text-lighterSecondaryGrey text-sm items-end">
                                { position[player].playerValues.jersey 
                                  ? <>
                                        <span>#{ position[player].playerValues.jersey }</span>
                                        <span>&#183;</span>
                                    </>
                                  : null 
                                }                                 
                                <span>
                                    { player == "1" 
                                      ? "Starter"
                                      : player + getOrdinal(Number(player)) + " string"
                                    }
                                </span>
                            </p>
                        </div>
                    </td>
                    <td className={ tableCellClasses }>{ position[player].playerValues.age ? position[player].playerValues.age : "N/A" }</td>
                    <td className={ tableCellClasses }>{ position[player].playerValues.height }</td>
                    <td className={ tableCellClasses }>{ position[player].playerValues.weight }</td>
                    <td className={ tableCellClasses }>{ position[player].playerValues.college ? position[player].playerValues.college : "Unknown" }</td>
                    <td className={ tableCellClasses }>
                        { position[player].playerValues.experience == 0
                          ? "Rookie"
                          : <span>{ position[player].playerValues.experience + getOrdinal(position[player].playerValues.experience) } season</span>
                        }
                    </td>
                </tr>
            )}
        </>)
    }
 
    useEffect(() => {
        setSpinner(true),
        getTeamRoster(),
        getTeamAltColor()
    }, [teamID]);

    return (
        <>
            <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2">
                <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Current Roster</h2>
                <div className="font-rubik flex">
                    <button 
                    className="md:hidden border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                    onClick={ () => setPopupActive(prevState => !prevState) }
                    >
                        Filters
                    </button>
                    <FilterList tags={ tags } teamID={ teamID } isMobile={ false } showTeamColors={ true } filter={ filter } childToParent={ childToParent }/>
                </div>
            </div>    
            { spinner 
              ? <div className="w-full flex justify-center mt-5">
                    <ReactLoading type="spin" height={100} width={75} />
                </div>
              : <>  
                    { popupActive && <FilterList tags={ tags } teamID={ teamID } isMobile={ true } showTeamColors={ true } filter={ filter } childToParent={ childToParent }/> } 
                    { displayPositions() }
                </>
            }
        </>
    )
}