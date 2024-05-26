import 'client-only';
import { useState, useEffect, memo } from 'react';
import getAllTeams from '../apiCalls/getAllTeams';
import teamDivisions from './data/teamDivisions.json';
import FilterList from './FilterList';
import TeamCard from './TeamCard';

function ListOfTeams({ childToParent }) {
    const [teams, setTeams] = useState([]);
    const [filter, setFilter] = useState("All");
    const [divisionFilter, setDivisionFilter] = useState("");
    const [popupActive, setPopupActive] = useState(false);

    const afcTags = ["AFC North", "AFC South", "AFC East", "AFC West"];
    const nfcTags = ["NFC North", "NFC South", "NFC East", "NFC West"];

    const getTeams = () => getAllTeams().then(
        (res) => setTeams(res)
    );
  
    // gets the selected division filter from FilterList
    const filterChildToParent = (dataFromChild) => setFilter(dataFromChild);

    // when the user selects a division filter, adds all teams in the division to an array
    const filterArray = () => {
        let content = [];  
        teamDivisions[filter].map(divisionTeam =>
            content.push(teams.find(teamsTeam => teamsTeam.id == divisionTeam.id))
        );
        return content;
    }

    const handleFilterClick = (buttonTag, oppButtonTag) => {
        setDivisionFilter(buttonTag); 
        divisionFilter == oppButtonTag ? null : setPopupActive(prevState => !prevState);
    }

    // run getTeams() when the page loads
    useEffect(() => {
        getTeams()
    }, []);

    return (
        <section className="xl:m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            <div className="flex mb-6 justify-between">
                <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Teams</h2>
                <div className="font-rubik flex">
                    <button 
                        className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                        onClick = { () => handleFilterClick("afc", "nfc") }
                    >
                        AFC
                    </button>
                    <button 
                        className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                        onClick = { () => handleFilterClick("nfc", "afc") }
                    >
                        NFC
                    </button>
                </div>
            </div>

            { popupActive && <FilterList tags={ divisionFilter == "afc" ? afcTags : nfcTags } teamID={ "" } isMobile={ "override" } showTeamColors={ false } filter={ filter } childToParent={ filterChildToParent }/> } 
            
            { filter == "All" ? null : <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">{ filter }</h3> }
            {/*<div className="grid gap-4 md:gap-7 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">*/}
            <div className="grid gap-2 md:gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                { filter !== "All" 
                    ? filterArray().map(team =>
                        <TeamCard childToParent={ childToParent } team={ team } />
                    )
                    : teams.map(team =>
                        <TeamCard childToParent={ childToParent } team={ team } />
                    )
                }
            </div>
        </section>
    )
}

export default memo(ListOfTeams);