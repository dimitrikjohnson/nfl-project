import 'client-only';
import { useState, useEffect, memo } from 'react';
import getAllTeams from '../apiCalls/getAllTeams';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
import teamDivisions from './data/teamDivisions.json';
import FilterList from './FilterList';

function ListOfTeams({ childToParent }) {
    const [teams, setTeams] = useState([]);
    const [sbWinner, setSBWinner] = useState({});
    const [filter, setFilter] = useState("All");
    const [divisionFilter, setDivisionFilter] = useState("");
    const [popupActive, setPopupActive] = useState(false);
    const afcTags = ["AFC North", "AFC South", "AFC East", "AFC West"];
    const nfcTags = ["NFC North", "NFC South", "NFC East", "NFC West"];

    const getTeams = () => getAllTeams().then(
        (res) => setTeams(res)
    );

    const getSBWinner = () => getSuperBowlWinner().then(
        (res) => {
            if (res) {
                setSBWinner({
                    headline: res.headline, 
                    winner: res.winnerID
                })
            }
        }
    );

    // gets the selected division filter from FilterList
    const filterChildToParent = (dataFromChild) => setFilter(dataFromChild);

    // when the user selects a division filter, adds all teams in the division to an array
    const filterArray = () => {
        let content = [];
        
        teamDivisions[filter].map(divisionTeam =>
            content.push(teams.find(teamsTeam => teamsTeam.team.id == divisionTeam.id))
        )
        
        return content;
    }

    const handleFilterClick = (buttonTag, oppButtonTag) => {
        setDivisionFilter(buttonTag); 
        divisionFilter == oppButtonTag ? null : setPopupActive(prevState => !prevState)
    }

    const displayTeamCard = (thisTeam) => {
        return (
            <a href="#top-of-page" key={ thisTeam.team.id }
            // tell parent which team was selected by sending their ID
            onClick={ () => childToParent(thisTeam.team.id) }
            aria-selected={ sbWinner.winner == thisTeam.team.id }
            className="p-2.5 rounded-md transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
            style={{ backgroundColor: "#" + thisTeam.team.color }}
            > 
                { sbWinner.winner == thisTeam.team.id &&
                    <p className="font-rubik text-gold text-center">{ sbWinner.headline } Champions</p> 
                }
                <div>
                    <img src={ thisTeam.team.shortDisplayName == 'Giants' || 'Jets' ? thisTeam.team.logos[1].href : thisTeam.team.logos[0].href } 
                         alt={ thisTeam.team.displayName + " logo" } 
                    />
                </div>
                <p className="font-rubik text-lg font-semibold text-center" style={{ color: "#" + thisTeam.team.alternateColor }}>{ thisTeam.team.displayName }</p>
            </a>
        )
    }
    
    // run getTeams() when the page loads
    useEffect(() => {
        getTeams()
        getSBWinner()
    }, [])

    return (
        <section className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            <div className="flex mb-6 justify-between">
                <h1 className="font-protest text-5xl uppercase">Teams</h1>
                <div className="font-rubik flex">
                    <button className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                    onClick = { () => handleFilterClick("afc", "nfc") }
                    >
                        AFC
                    </button>
                    <button className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" 
                    onClick = { () => handleFilterClick("nfc", "afc") }
                    >
                        NFC
                    </button>
                </div>
            </div>

            { popupActive && <FilterList tags={ divisionFilter == "afc" ? afcTags : nfcTags } teamID={ "" } isMobile={ "override" } showTeamColors={ false } filter={ filter } childToParent={ filterChildToParent }/> } 
            
            { filter == "All" ? null : <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">{ filter }</h3> }
            <div className="grid gap-4 md:gap-7 grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                { filter !== "All" 
                    ? filterArray().map(team =>
                        displayTeamCard(team)
                    )
                    : teams.map(team =>
                        displayTeamCard(team)
                    )
                }
            </div>
        </section>
    )
}

export default memo(ListOfTeams)