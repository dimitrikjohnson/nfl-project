import 'client-only';
import { useState, useEffect } from 'react';
import Overview from './Overview';
import Schedule from './Schedule';
import Roster from './Roster';

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
            case "Roster":
                return <Roster teamID={ teamID } />
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
            <div className="font-rubik w-full bg-sectionColor flex flex-nowrap justify-between overflow-x-auto px-4 md:px-6 lg:px-14 3xl:m-auto mb-11">
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
            <section className="mx-4 md:mx-6 lg:mx-14 3xl:m-auto 3xl:max-w-[1700px]">
                { tabWindows(selectedTab) }
            </section>
        </>
    )
}