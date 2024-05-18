import 'client-only';
import { useState, useEffect, memo } from 'react';
import getAllTeams from '../apiCalls/getAllTeams';
import getSuperBowlWinner from '../apiCalls/getSuperBowlWinner';
import teamDivisions from './data/teamDivisions.json';
import FilterList from './FilterList';

function ListOfTeams({ childToParent }) {
    //const [content, setContent] = useState([]);
    const [teams, setTeams] = useState([]);
    const [sbWinner, setSBWinner] = useState({});
    const [filter, setFilter] = useState("All");
    const [divisionFilter, setDivisionFilter] = useState("");
    const [convertedFilter, setConvertedFilter] = useState("All");
    const [popupActive, setPopupActive] = useState(false);
    //const tags = ["All", "AFC North", "AFC South", "AFC East", "AFC West", "NFC North", "NFC South", "NFC East", "NFC West"];
    const afcTags = ["AFC North", "AFC South", "AFC East", "AFC West"];
    const nfcTags = ["NFC North", "NFC South", "NFC East", "NFC West"];

    const getTeams = () => getAllTeams().then(
        (res) => {
            //console.log(res)
            setTeams(res)
        } 
    )

    const getSBWinner = () => getSuperBowlWinner().then(
        (res) => {
            if (res) {
                setSBWinner({
                    headline: res.headline, 
                    winner: res.winnerID
                })
            }
        }
    )

    const handleFilterPick = (tag) => {
        setFilter(tag);
        setPopupActive(false);
    }

    const filterChildToParent = (dataFromChild) => setFilter(dataFromChild);

    const convertFilter = (filter) => {
        setConvertedFilter(filter.toLowerCase().replace(/\s/g, ''))
        
    }

    
    const filterArray = () => {
        let content = []
        //if (filter == Object.keys(teamDivisions)[0].toString() ) {
            teamDivisions[filter].map(xteam =>
               //console.log(team.id)
               content.push(teams.find(newteam => newteam.team.id == xteam.id))
            )
            console.log(content)
            return content
            content.map( x => 
                <a
                href="#top-of-page" 
                // tell parent which team was selected by sending their ID
                onClick={ () => childToParent(x.team.id) }
                aria-selected={ sbWinner.winner == x.team.id }
                key={ x.team.id } 
                className="p-1.5 rounded-md transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
                style={{ backgroundColor: "#" + x.team.color }}
                > 
                    { sbWinner.winner == x.team.id 
                        ? <p className="font-rubik text-gold text-center">{ sbWinner.headline } Champions</p> 
                        : null 
                    }
                    <div>
                        <img src={ x.team.shortDisplayName == 'Giants' || 'Jets'
                            ? x.team.logos[1].href 
                            : x.team.logos[0].href } alt={ x.team.displayName + " logo" 
                            
                        } />
                    </div>
                    <p className="font-rubik text-lg font-semibold text-center" style={{ color: "#" + x.team.alternateColor }}>{ x.team.displayName }</p>
                </a>
            )
        //}
    }
    
    // run getTeams() when the page loads
    useEffect(() => {
        getTeams()
        getSBWinner()
        //console.log("og fire")
    }, [])


    return (
        <section className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            <div className="flex mb-6 justify-between">
                <h1 className="font-protest text-5xl uppercase">Teams</h1>
                <div className="font-rubik flex">
                   
                    <button className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" onClick = {() => {setDivisionFilter("afc"); divisionFilter == "nfc" ? null : setPopupActive(prevState => !prevState) }}>AFC</button>
                    <button className="border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] px-3.5 rounded-md" onClick = {() => {setDivisionFilter("nfc"); divisionFilter == "afc" ? null : setPopupActive(prevState => !prevState)}}>NFC</button>
                </div>
            </div>
            { popupActive && <FilterList tags={ divisionFilter == "afc" ? afcTags : nfcTags } teamID={ "" } isMobile={ "override" } showTeamColors={ false } filter={ filter } childToParent={ filterChildToParent }/> } 
            {filter == "All" ? null : <h3 className="font-protest text-2xl 2xl:text-3xl pb-2">{ filter }</h3>}
            <div className="grid gap-4 md:gap-7 grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                { filter !== "All" ? 
                    <> { filterArray().map((x) =>
                        <a
                        href="#top-of-page" 
                        // tell parent which team was selected by sending their ID
                        onClick={ () => childToParent(x.team.id) }
                        aria-selected={ sbWinner.winner == x.team.id }
                        key={ x.team.id } 
                        className="p-1.5 rounded-md transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
                        style={{ backgroundColor: "#" + x.team.color }}
                        > 
                            { sbWinner.winner == x.team.id 
                                ? <p className="font-rubik text-gold text-center">{ sbWinner.headline } Champions</p> 
                                : null 
                            }
                            <div>
                                <img src={ x.team.shortDisplayName == 'Giants' || 'Jets'
                                    ? x.team.logos[1].href 
                                    : x.team.logos[0].href } alt={ x.team.displayName + " logo" 
                                    
                                } />
                            </div>
                            <p className="font-rubik text-lg font-semibold text-center" style={{ color: "#" + x.team.alternateColor }}>{ x.team.displayName }</p>
                        </a>
                    ) }</>
                    : teams.map((x) =>
                        <a
                        href="#top-of-page" 
                        // tell parent which team was selected by sending their ID
                        onClick={ () => childToParent(x.team.id) }
                        aria-selected={ sbWinner.winner == x.team.id }
                        key={ x.team.id } 
                        className="p-1.5 rounded-md transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-90 md:hover:scale-110 aria-selected:border-2 aria-selected:border-gold duration-300 motion-reduce:transition-none motion-reduce:hover:transform-none" 
                        style={{ backgroundColor: "#" + x.team.color }}
                        > 
                            { sbWinner.winner == x.team.id 
                                ? <p className="font-rubik text-gold text-center">{ sbWinner.headline } Champions</p> 
                                : null 
                            }
                            <div>
                                <img src={ x.team.shortDisplayName == 'Giants' || 'Jets'
                                    ? x.team.logos[1].href 
                                    : x.team.logos[0].href } alt={ x.team.displayName + " logo" 
                                    
                                } />
                            </div>
                            <p className="font-rubik text-lg font-semibold text-center" style={{ color: "#" + x.team.alternateColor }}>{ x.team.displayName }</p>
                        </a>
                    )}
            </div>
        </section>
    )
}

export default memo(ListOfTeams)