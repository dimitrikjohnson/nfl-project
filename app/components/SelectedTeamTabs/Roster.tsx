import 'client-only';
import { useState, useEffect } from 'react';
import ReactLoading from "react-loading";
import Image from "next/image";
import DefaultHeadshot from '../../images/default_headshot.png';
import getRoster from '@/app/apiCalls/getRoster';
import getTeam from '@/app/apiCalls/getTeam';

export default function Roster({ teamID }) {
    const [teamAltColor, setTeamAltColor] = useState("");
    const [roster, setRoster] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const labelClasslist = "uppercase text-lighterSecondaryGrey mr-2.5";

    const getTeamRoster = () => {
        setSpinner(true);
        
        getRoster(teamID).then((res) => {
            setSpinner(false);
            setRoster(res);
        });
    }

    const getTeamAltColor = () => getTeam({teamID}).then(
        (res) => setTeamAltColor(res.alternateColor)
    );

    const displayPositions = () => {
        return (
            <>
                { Object.keys(roster).map(position =>
                    <div key={ position } className="mb-8 last-of-type:mb-0">
                        <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">
                            { position }{ Object.keys(roster[position]).length > 1 ? "s" : null }
                        </h3>
                        <div className="font-rubik grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6">
                            { displayPlayerCards(roster[position]) }
                        </div>
                    </div>
                )}
            </>
        )
    }

    const displayPlayerCards = (position) => {
        // determine the suffix for the player's position on the depth chart
        const getOrdinal = (num) => {
            let ord = 'th';

            if (num % 10 == 1 && n % 100 != 11) { ord = 'st'; }
            else if (num % 10 == 2 && num % 100 != 12) { ord = 'nd'; }
            else if (num % 10 == 3 && num % 100 != 13) { ord = 'rd'; }

            return ord;
        }
        return (
            <>
                { Object.keys(position).map(player =>
                    <div key={ position[player].playerValues.name } className="bg-sectionColor p-3 rounded-md">
                        <div className="pb-1 mb-3 border-b flex gap-2">
                            <p className="font-semibold">{ position[player].playerValues.name }</p>
                            <p className="flex gap-1.5 text-lighterSecondaryGrey">
                                { position[player].playerValues.jersey 
                                  ? <>
                                        <span>{ position[player].playerValues.jersey }</span>
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
                        <div className="flex gap-3">
                            <div className="w-40 relative rounded-sm shrink-0" style={{ background: '#' + teamAltColor }}>
                                { position[player].playerValues.headshot
                                  ? <img className="absolute bottom-0" src={ position[player].playerValues.headshot } alt={ position[player].playerValues.name } />
                                  : <Image className="w-40 object-cover" src={ DefaultHeadshot }  alt="Default profile picture" priority />
                                }
                            </div>
                            <div>
                                <p className="pb-1.5">
                                    <span className={ labelClasslist }>Age:</span>
                                    <span>{ position[player].playerValues.age }</span>
                                </p>
                                <p className="pb-1.5">
                                    <span className={ labelClasslist }>HT/WT:</span>
                                    <span>{ position[player].playerValues.height }, { position[player].playerValues.weight }</span>
                                </p>
                                <p className="pb-1.5">
                                    <span className={ labelClasslist }>College:</span>
                                    <span>{ position[player].playerValues.college ? position[player].playerValues.college : "N/A" }</span>
                                </p>
                                <p>
                                    <span className={ labelClasslist }>Experience:</span>
                                    <span>{ position[player].playerValues.experience }</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    useEffect(() => {
        getTeamRoster(),
        getTeamAltColor()
    }, [teamID])

    return (
        <>
            <div className="flex justify-between pb-2 mb-9 border-b-2">
                <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Current Roster</h2>
                {/*
                <select className="text-gray-900 bg-cyan-400 rounded-md">
                    <option value="Selected" hidden>Jump to Position</option>
                    <option value="banana">Banana</option>
                    <option value="orange">Orange</option>
                </select> 
                */}
            </div>
            { spinner 
              ? <div className="w-full flex justify-center mt-5">
                    <ReactLoading type="spin" height={100} width={75} />
                </div> 
              : displayPositions()
            }
        </>
    )
}