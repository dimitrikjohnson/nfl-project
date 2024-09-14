'use client';
import { useState, useEffect, useContext } from 'react';
import Image from "next/image";
import AFCLogo from "../images/afc.svg";
import NFCLogo from "../images/nfc.svg";
import Tabs from './SelectedTeamTabs/Tabs';
import getTeam from '../apiCalls/getTeam';
import allTeamsColors from "./data/allTeamsColors.json";
import { ThisSeason, SuperBowlWinner } from '../page';
import TeamSummary from './TeamSummary';

export default function SelectedTeam({ teamID }) {
    const [team, setTeam] = useState([]);
   // const [teamRecord, setTeamRecord] = useState("");
    const [teamLogo, setTeamLogo] = useState([]);
    const [teamColors, setTeamColors] = useState({});
    const [teamConference, setTeamConference] = useState();

    const afcNum = 8;
    //const currentSeason = useContext(ThisSeason);
    //const sbWinner = useContext(SuperBowlWinner);

    const getSelectedTeam = () => getTeam({teamID}).then(
        (res) => {
            setTeam(res);
            setTeamConference(res.groups.parent.id);
            //Object.keys(res.record).length != 0 && setTeamRecord(res.record.items[0].summary);

            // the color of the Giants' and Jets' default logo isn't viewable against their primary color
            res.shortDisplayName == "Giants" || "Jets" ? setTeamLogo(res.logos[1]) : setTeamLogo(res.logos[0]);
        }
    );

    // run these functions every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        setTeamColors(allTeamsColors[teamID]),
        getSelectedTeam()
    }, [teamID]);

    return (
        <section className="w-full mb-24">
            <div className="grid md:flex relative h-64 md:h-80 overflow-hidden items-center">
                <div className="absolute w-full h-full" style={{ backgroundColor: teamColors.bgColor }}></div>
                <div className="md:flex relative w-full justify-between items-center md:mx-6 lg:mx-14 3xl:m-auto 3xl:max-w-[1700px]">
                    <img className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" src={ teamLogo.href } alt={ team.displayName + " logo" } />
                    <div className="text-center" style={{ color: teamColors.textColor }}>
                        <p className="font-protest uppercase text-3xl md:text-5xl mb-1">{ team.location }</p>
                        <p className="font-protest uppercase text-6xl md:text-8xl mb-2">{ team.name }</p>
                        <p className="font-rubik text-sm md:text-base font-semibold flex gap-1.5 justify-center">
                            <TeamSummary team={ team } hasTrophy={ true } />
                        </p>
                    </div>
                    { teamConference == afcNum 
                        ? <Image src={ AFCLogo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt="AFC Logo" priority />
                        : <Image src={ NFCLogo } className="hidden md:block w-12 sm:w-24 md:w-28 lg:w-40" alt="NFC Logo" priority />
                    }
                </div>
                <div className="flex gap-7 relative justify-center md:hidden">
                    <img className="w-16" src={ teamLogo.href } alt={ team.displayName + " logo" } />
                    { teamConference == afcNum 
                        ? <Image src={ AFCLogo } className="w-16" alt="AFC Logo" priority />
                        : <Image src={ NFCLogo } className="w-16" alt="NFC Logo" priority />
                    }
                </div>
            </div>
            <Tabs teamID={ teamID } />    
        </section>
    )
}