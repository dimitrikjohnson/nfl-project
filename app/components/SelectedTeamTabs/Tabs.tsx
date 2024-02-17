import 'client-only';
import { useState, useEffect } from 'react';
import Overview from './Overview';
import Schedule from './Schedule';

export default function Tabs({ teamID }) {
    const [selectedTab, setSelectedTab] = useState("Overview")

    const tabs = ["Overview", "Schedule", "Roster", "Statistics", "Team leaders"]

    const handleClick = (e) => {
        setSelectedTab(e)
    }

    const tabWindows = (selectedTab) => {
        switch(selectedTab) {
            case "Overview":
                return <Overview teamID={ teamID } />
            case "Schedule":
                return <Schedule teamID={ teamID } />
            default:
                return null
        }
    }

    // reset the tab list to "Overview" every time teamID updates (aka when a new card is clicked)
    useEffect(() => {
        setSelectedTab("Overview")
    }, [teamID])
    
    return (
        <>
            <div className="font-rubik w-full bg-sectionColor rounded-md flex flex-nowrap justify-between md:justify-around overflow-x-auto mb-9">
                { tabs.map((tab) =>
                    <button 
                    key={ tab } 
                    aria-selected={ tab == selectedTab } 
                    onClick={() => handleClick(tab) } 
                    className="hover:bg-secondaryGrey/[0.25] px-2 lg:px-3.5 py-3 uppercase aria-selected:bg-stone-900 aria-selected:border-b-2 aria-selected:border-cyan-400"
                    >
                        { tab }
                    </button> 
                )}
            </div>
            { tabWindows(selectedTab) }
        </>
    )
}