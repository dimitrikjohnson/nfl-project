'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootballBall } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import allTeamsColors from '@/app/data/allTeamsColors.json';
//import Image from "next/image";
//import ProcessLogo from '@/public/theProcess.svg';
import TeamSummary from './TeamSummary';

export default function NavBar({ team }) {
    const [showNav, setShowNav] = useState(true);
    const [scrolledNav, setScrolledNav] = useState(false);

    // hide the top nav bar when scrolling over header; make it return when it passes the mid-screen navbar
    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY < 75) {
                setShowNav(true);
            }
            else if (window.scrollY > 350) {
                setShowNav(true);
                setScrolledNav(true);
            }
            else {
                setShowNav(false);
                setScrolledNav(false);
            }
        });
    }, []);

    return (
        <nav 
            className={`font-rubik fixed w-full flex justify-between py-2.5 px-6 md:px-11 top-0 z-10 ${ showNav || "hidden" } ${ scrolledNav && "drop-shadow-md" }`}
            style={ scrolledNav ? { backgroundColor: allTeamsColors[team.id].bgColor } : null }
        >
            <Link 
                href={ '/' } 
                className="flex gap-2 items-center text-xl"
                style={{ color: allTeamsColors[team.id].textColor }}
            >
                <FontAwesomeIcon icon={faFootballBall} rotation={90} />
                <p className="font-protest tracking-wide">THE PROCESS</p>
            </Link>
            <div 
                className={`${ scrolledNav ? "flex gap-2" : "hidden" } items-center`}
                style={{ color: allTeamsColors[team.id].textColor }}
            >
                <p className="font-semibold">
                    <span className="hidden md:block">{ team.displayName }</span>
                    <span className="block md:hidden">{ team.shortDisplayName }</span>
                </p>
                <p className="text-sm flex gap-1.5">
                    <TeamSummary team={ team } hasTrophy={ false }/>
                </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
                <Link 
                    href={ '/' } 
                    className="bg-transparent hover:bg-transparent"
                    style={{ 
                        //backgroundColor: allTeamsColors[team.id].textColor, 
                        color: allTeamsColors[team.id].textColor,
                        //border: `1px solid ${allTeamsColors[team.id].textColor}`
                    }}
                >
                    League Overview
                </Link>
                <Link 
                    href={ '/teams' } 
                    className="btn h-8 min-h-8 border-0"
                    style={{ 
                        backgroundColor: allTeamsColors[team.id].textColor, 
                        color: allTeamsColors[team.id].bgColor 
                    }}
                >
                    Teams
                </Link>
            </div>
        </nav>
    );
}