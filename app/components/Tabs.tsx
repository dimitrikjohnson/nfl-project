'use client';
import { useState, SetStateAction } from 'react';
import Link from "next/link";
import useCurrentPath from '@/app/helpers/getCurrentPath';

interface TabItems {
    [key: string]: {
        content: React.ReactNode;
    };
}

export default function Tabs({ items, teamName }: { items: TabItems, teamName: string }) {
    const currentPath = useCurrentPath();
 
    // currentPath gets the part of the URL that comes after /teams; determine if that is a valid tab or not
    const [selectedTab, setSelectedTab] = useState(items[currentPath] ? currentPath : "overview");

    const linkPrefix = `/teams/${teamName}`;
    
    const handleClick = (e: SetStateAction<string>) => setSelectedTab(e);
    
    return (
        <>
            <nav className="font-rubik w-full bg-section dark:bg-section-dark mb-11">
                <div className="w-full flex flex-nowrap justify-between overflow-x-auto m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                    { Object.keys(items).map(item =>
                        <Link 
                            key={ item } 
                            href={ item == "overview" ? linkPrefix : `${linkPrefix}/${item}` }
                            aria-selected={ item == selectedTab } 
                            onClick={ () => handleClick(item) } 
                            className="hover:bg-secondaryGrey/[0.25] px-2 lg:px-3.5 py-3 uppercase aria-selected:font-semibold \
                                aria-selected:border-b-2 aria-selected:border-cyan-500 dark:aria-selected:border-cyan-400"
                        >
                            { item }
                        </Link> 
                    )}
                </div>
            </nav>
            <section className="m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
                { items[selectedTab].content }
            </section>
        </>
    )
}