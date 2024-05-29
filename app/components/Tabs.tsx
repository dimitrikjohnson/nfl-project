'use client';
import { useState, useContext, useEffect } from 'react';
import Link from "next/link";
import { Team } from '../contextProviders/teamProvider';
import getCurrentPath from '../helpers/getCurrentPath';

export default function Tabs({ items }) {
    const currentPath = getCurrentPath();
    const [selectedTab, setSelectedTab] = useState(isNaN(currentPath) ? currentPath : "overview");

    const teamID = useContext(Team).id;
    const linkPrefix = `/teams/${teamID}`;
    
    const handleClick = (e) => setSelectedTab(e);

    //console.log(selectedTab)
    //useEffect(() => {
    //    setSelectedTab("overview")
    //}, []);
    
    return (
        <>
            <nav className="font-rubik w-full bg-sectionColor flex flex-nowrap justify-between overflow-x-auto px-4 md:px-6 lg:px-14 3xl:m-auto mb-11">
                { Object.keys(items).map(item =>
                    <Link 
                        key={ item } 
                        href={ item == "overview" ? linkPrefix : `${linkPrefix}/${item}` }
                        aria-selected={ item == selectedTab } 
                        onClick={ () => handleClick(item) } 
                        className="hover:bg-secondaryGrey/[0.25] px-2 lg:px-3.5 py-3 uppercase aria-selected:font-semibold aria-selected:border-b-2 aria-selected:border-cyan-400"
                    >
                        { item }
                    </Link> 
                )}
            </nav>
            <section className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                { items[selectedTab].content }
            </section>
        </>
    )
}