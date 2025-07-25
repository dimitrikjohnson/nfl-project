// this button appears on teams/[teamName]/schedule and player/[playerSlug]/games

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

type DropdownItems = {
    colors: {
        bg: string;
        text: string;
    };
    displaySeason: string | number | undefined;
    allYears: number[];
}

export default function YearDropdownButton({ colors, displaySeason, allYears }: DropdownItems) {
    // close the dropdown menu when item is selected
    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            (elem as HTMLElement).blur();
        }
    };

    return (
        <div className="dropdown dropdown-end">
            <div 
                tabIndex={0} 
                role="button" 
                className="flex btn h-10 min-h-10"
                style={{ 
                    backgroundColor: colors.bg, 
                    color: colors.text, 
                    border: `1px solid ${colors.text}` 
                }}
            >
                { displaySeason }
                <FontAwesomeIcon icon={faCaretDown} className="" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-section dark:bg-section-dark rounded-md w-28">
                { allYears.map(year =>
                    <li key={ year } onClick={ handleClick }>
                        <Link href={`?season=${year}`}>{ year }</Link>    
                    </li>   
                )}
            </ul>
        </div>
    )
}