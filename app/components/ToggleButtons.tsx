'use client';
import React from "react";

type ToggleProps<T extends string> = {
    options: T[];       // allow extensions of string (like string unions)
    extraClasses?: string;
    valueToMatch: string;
    onChange: (value: T) => void;
    renderLabel?: (value: T) => React.ReactNode; 
    uppercase?: boolean; // optional helper for styling consistency
}

// toggle buttons for switching between given options
export default function ToggleButtons<T extends string>({ options, extraClasses="", valueToMatch, onChange, renderLabel, uppercase }: ToggleProps<T>) {
    return (
        <div className={`gap-2.5 md:gap-3 ${extraClasses}`}>
            { options.map(option => {
                const isActive = valueToMatch === option;
                return (
                    <button 
                        key={ option } 
                        className={`btn h-8 min-h-8 px-3.5 md:px-4 md:h-10 md:min-h-10 dark:border-none ${uppercase ? "uppercase": ""} ${ isActive 
                            ? "bg-primary text-primary-dark hover:bg-primary hover:text-primary-dark border-none \
                                dark:bg-primary-dark dark:text-backdrop-dark dark:hover:bg-primary-dark dark:hover:text-backdrop-dark" 
                            : "bg-alt-table-row text-primary border border-gray-300 hover:bg-secondaryGrey/[0.25] \
                                dark:border-none dark:bg-alt-table-row-dark dark:text-primary-dark" 
                        }`}
                        onClick={ () => onChange(option) }
                    >
                        {/* If renderLabel is provided, use it; otherwise fallback to plain text */}
                        { renderLabel ? renderLabel(option) : option }
                    </button>    
                ) 
            })}   
        </div>
    )
}