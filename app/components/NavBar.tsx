'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFootball } from '@fortawesome/free-solid-svg-icons';
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
            style={ scrolledNav && team ? { backgroundColor: allTeamsColors[team.id]?.bgColor } : null }
        >
            <Link 
                href={ '/' } 
                className="flex gap-2 items-center text-lg md:text-xl"
                style={{ color: team ? allTeamsColors[team.id]?.textColor : "#FFFFFF" }}
            >
                <FontAwesomeIcon icon={faFootball} rotation={90} className="" />
                <p className="font-protest tracking-wide uppercase">Big Football</p>
            </Link>
            <div 
                className={`${ scrolledNav && team ? "flex gap-2" : "hidden" } items-center`}
                style={ team ? { color: allTeamsColors[team.id]?.textColor } : null }
            >
                <p className="font-semibold">
                    <span className="hidden md:block">{ team?.displayName }</span>
                    <span className="block md:hidden">{ team?.shortDisplayName }</span>
                </p>
                <p className="hidden md:flex text-sm gap-1.5">
                    { team && <TeamSummary team={ team } hasTrophy={ false }/> }
                </p>
            </div>
            <div className="items-center gap-3">
                { /*
                <Link 
                    href={ '/' } 
                    className="bg-transparent hover:text-cyan-400 hover:bg-transparent"
                    style={{ color: team ? allTeamsColors[team.id]?.textColor : "#FFFFFF" }}
                >
                    League Overview
                </Link>
                */ }
                <Link 
                    href={ '/teams' } 
                    className={`btn h-8 min-h-8 border-0 ${ Object.keys(team).length || "bg-cyan-400 text-[#1c232b]" }`}
                    style={{ 
                        backgroundColor: team ? allTeamsColors[team.id]?.textColor : null, 
                        color: team ? allTeamsColors[team.id]?.bgColor : null 
                    }}
                >
                    Teams
                </Link>
            </div>
        </nav>
    );
}