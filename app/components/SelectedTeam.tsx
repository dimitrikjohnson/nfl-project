import 'client-only';
import { useState, useEffect } from 'react';
import Image from "next/image";
import AFCLogo from "../images/afc.svg";
import NFCLogo from "../images/nfc.svg";
import Tabs from './SelectedTeamTabs/Tabs';
import getTeam from '../apiCalls/getTeam';
import getTeamSchedule from '../apiCalls/getTeamSchedule';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
import allTeamsColors from "./data/allTeamsColors.json";

export default function SelectedTeam({ teamID }) {
    const [team, setTeam] = useState([]);
    const [teamRecord, setTeamRecord] = useState("");
    const [teamLogo, setTeamLogo] = useState([]);
    const [teamColors, setTeamColors] = useState({});
    //const [teamTextColor, setTeamTextColor] = useState("")
    //const [teamVenueImage, setTeamVenueImage] = useState("")
    const [teamConference, setTeamConference] = useState();
    const [sbWinner, setSBWinner] = useState({});

    const afcNum = 8;

    const getSelectedTeam = () => getTeam({teamID}).then(
        (res) => {
            setTeam(res);
            setTeamConference(res.groups.parent.id);
            setTeamColors(allTeamsColors[res.id])

            // the Chargers don't have an image of their venue; this statement prevents an error from being thrown for that
            /*
            if (res.franchise.venue.images.length > 0) {
                setTeamVenueImage(res.franchise.venue.images[0].href)
            }
            else {
                setTeamVenueImage("")
            }
            */
            // the color of the Giants' and Jets' default logo isn't viewable against their primary color
            res.shortDisplayName == "Giants" || "Jets" ? setTeamLogo(res.logos[1]) : setTeamLogo(res.logos[0]);
        }
    );

    const getSelectedTeamRecord = () => getTeamSchedule(teamID).then(
        (res) => setTeamRecord(res.team.recordSummary)
    );

    const getSBWinner = () => getSuperBowlWinner().then(
        (res) => {
            if (res) {
                setSBWinner({
                    headline: res.headline, 
                    winner: res.winnerID
                });
            }
        }
    );
    
    useEffect(() => {
        getSBWinner()
    }, []);
   
    // run these functions every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        getSelectedTeam(),
        getSelectedTeamRecord()
    }, [teamID]);

    return (
        <section className="w-full mb-24">
            <div className="grid md:flex relative h-64 md:h-96 overflow-hidden items-center">
                {/* 
                teamVenueImage
                    ? <img className="absolute w-full left-0 top-0 scale-[2] md:scale-125 origin-[50%_30%] md:origin-[50%_70%] h-auto opacity-5 mix-blend-luminosity" src={ teamVenueImage } alt={ team.displayName + " venue" } />
                    : null
    */}
                {  /*<div className="absolute w-full h-full blur-md" style={{ background: 'linear-gradient(to bottom, #' + team.color + ', #' + team.alternateColor + ')' }}></div>*/ }
                <div className="absolute w-full h-full" style={{ backgroundColor: teamColors.bgColor }}></div>
                <div className="md:flex relative w-full justify-between items-center md:mx-6 lg:mx-14 3xl:m-auto 3xl:max-w-[1700px]">
                    { /*
                    <div className="flex justify-center md:block">
                        <div className="w-40 p-1 rounded-md" 
                        style={{ background: 'linear-gradient(to bottom right, #' + team.color + ' 0%, #' + team.color + ' 50%, #' + team.alternateColor + ' 50%, #' + team.alternateColor + ' 100%)'}}
                        >
                            <img src={ teamLogo.href } alt={ team.displayName + " logo" } />
                        </div>
                    </div>
                    */}
                    <img className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" src={ teamLogo.href } alt={ team.displayName + " logo" } />
                    <div className="text-center" style={{ color: teamColors.textColor }}>
                        <p className="font-protest uppercase text-3xl md:text-5xl mb-1">{ team.location }</p>
                        <p className="font-protest uppercase text-6xl md:text-8xl mb-2">{ team.name }</p>
                        <p className="font-rubik text-sm md:text-base font-semibold flex justify-center">
                            { teamRecord } &#183; { team.standingSummary} 
                            { sbWinner.winner == teamID 
                                ? <p className="font-rubik flex items-end">
                                    <span className="px-1.5">&#183;</span>
                                    <span>&#127942;</span>
                                  </p> 
                                : null 
                            }
                        </p>
                    </div>
                    { teamConference == afcNum 
                        ? <Image src={ AFCLogo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt="AFC Logo" priority />
                        : <Image src={ NFCLogo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt="NFC Logo" priority />
                    }
                </div>
                { 
                <div className="flex relative justify-center md:hidden">
                    <img className="w-16 mr-7" src={ teamLogo.href } alt={ team.displayName + " logo" } />
                    { teamConference == afcNum 
                        ? <Image src={ AFCLogo } className="w-16" alt="AFC Logo" priority />
                        : <Image src={ NFCLogo } className="w-16" alt="NFC Logo" priority />
                    }
                </div>
                }
            </div>
            { /*
            <div className="grid md:flex gap-y-2.5 gap-x-5 items-center bg-cover bg-center" 
            style={{ backgroundImage: 'linear-gradient(black, black), url(' + teamVenueImage + ')', backgroundBlendMode: 'saturation'}}
            >
                <div className="flex justify-center md:block">
                    <div className="w-72 md:w-36 p-1 rounded-md" 
                    style={{ background: 'linear-gradient(to bottom right, #' + team.color + ' 0%, #' + team.color + ' 50%, #' + team.alternateColor + ' 50%, #' + team.alternateColor + ' 100%)'}}
                    >
                        <img src={ teamLogo.href } alt={ team.displayName + " logo"} />
                    </div>
                </div>
                <div className="grid md:flex gap-3 h-1/2">
                    <h1 className="font-protest flex items-end text-5xl uppercase">{ team.displayName }</h1>
                    <p className="font-rubik flex items-end text-secondaryGrey">
                        { teamRecord } | { team.standingSummary} 
                        { sbWinner.winner == teamID 
                            ? <p className="font-rubik flex items-end text-gold">
                                <span className="text-secondaryGrey px-1.5">|</span> { sbWinner.headline } Champions
                              </p> 
                            : null 
                        }
                    </p>
                </div>          
            </div>
            */ }
            <Tabs teamID={ teamID } />
        </section>
    )
}