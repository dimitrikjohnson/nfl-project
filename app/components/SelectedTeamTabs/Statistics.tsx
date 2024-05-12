import 'client-only';
import { useState, useEffect } from 'react';
import fetchCurrentSeason from "@/app/apiCalls/fetchCurrentSeason";
import TeamStatistics from './TeamStatistics';
import PlayerStatistics from './PlayerStatistics';
import FilterList from '../FilterList';

export default function Statistics({ teamID }) {
    const [currentSeason, setCurrentSeason] = useState("");
    const [filter, setFilter] = useState("team stats");
    const [popupActive, setPopupActive] = useState(false);
    const tags = ["team stats", "player stats"];

    const getCurrentSeason = () => fetchCurrentSeason().then(
        (res) => setCurrentSeason(res)
    );

    // gets the selected filter from FilterList
    const childToParent = (dataFromChild) => setFilter(dataFromChild);

    // only run getCurrentSeason() on the first render
    useEffect(() => {
        getCurrentSeason();
    }, []);

    return (<>
        <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2">
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">{ currentSeason } Statistics</h2>
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
        { popupActive && <FilterList tags={ tags } teamID={ teamID } isMobile={ true } showTeamColors={ true } filter={ filter } childToParent={ childToParent }/> }
        { filter == "team stats"
            ? <TeamStatistics teamID={ teamID }/>
            : <PlayerStatistics teamID={ teamID }/>
        }
    </>)
}