'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import teamDivisions from '@/app/data/teamDivisions.json';
import unslugifyQuery from '../helpers/unslugifyQuery';
import FilterList from './FilterList';
import TeamCard from './TeamCard';

export default function FilterTeams({ teams }) {
    const [divisionFilter, setDivisionFilter] = useState("");
    const [popupActive, setPopupActive] = useState(false);

    // gets the 'division' query from the URL
    const searchParams = useSearchParams();
    const division = searchParams.has('division') && searchParams.get('division');

    const afcTags = ["AFC North", "AFC South", "AFC East", "AFC West"];
    const nfcTags = ["NFC North", "NFC South", "NFC East", "NFC West"];

    // when the user selects a division filter, adds all teams in the division to an array
    const filterArray = () => {
        let content = [];  
        teamDivisions[unslugifyQuery(division)].map(divisionTeam =>
            content.push(teams.find(teamsTeam => teamsTeam.id == divisionTeam.id))
        );
        return content;
    }

    const handleFilterClick = (buttonTag, oppButtonTag) => {
        setDivisionFilter(buttonTag); 
        divisionFilter == oppButtonTag ? null : setPopupActive(prevState => !prevState);
    }

    return (
        <>
            <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2">
                <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Teams</h2>
                <div className="font-rubik flex">
                    <Link 
                        href={ `?division=all` }
                        className="btn h-10 min-h-10 mr-2.5 border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] rounded-md"
                        onClick = { () => setPopupActive(false) }
                    >
                        All
                    </Link>
                    <button 
                        className="btn h-10 min-h-10 mr-2.5 border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] rounded-md" 
                        onClick = { () => handleFilterClick("afc", "nfc") }
                    >
                        AFC
                    </button>
                    <button 
                        className="btn h-10 min-h-10 border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] rounded-md"
                        onClick = { () => handleFilterClick("nfc", "afc") }
                    >
                        NFC
                    </button>
                </div>
            </div>

            { popupActive && <FilterList tags={ divisionFilter == "afc" ? afcTags : nfcTags } teamID={""} isMobile={ "override" } showTeamColors={ false } query={ "division" }/> } 
            
            { (division == "all" || !division) ? null : <h3 className="flex font-protest text-2xl 2xl:text-3xl pb-2 gap-1.5">{ unslugifyQuery(division, true) }</h3> }
            <div className="grid gap-2.5 md:gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                { division != "all" && division 
                    ? filterArray().map(team =>
                        <TeamCard key={ team.id } team={ team } />    
                    )
                    : teams.map(team =>
                        <TeamCard key={ team.id } team={ team } />
                    )
                }
            </div>
        </>
    )
}