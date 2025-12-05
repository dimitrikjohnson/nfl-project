'use client';
import React from "react";

type ToggleProps<T extends string> = {
    options: T[];       // allow extensions of string (like string unions)
    extraClasses?: string;
    valueToMatch: string;
    onChange: (value: T) => void;
    renderLabel?: (value: T) => React.ReactNode; 
    uppercase?: boolean; // optional helper for styling consistency
    fullWidth?: boolean; // optional helper for buttons that need to be full width on mobile
}

// toggle buttons for switching between given options
export default function ToggleButtons<T extends string>({ options, extraClasses="", valueToMatch, onChange, renderLabel, uppercase, fullWidth }: ToggleProps<T>) {
    return (
        <div className={`border border-gray-600/50 dark:border-lighterSecondaryGrey/50 rounded-md overflow-hidden ${extraClasses}`}>
            { options.map(option => {
                const isActive = valueToMatch === option;
                return (
                    <button 
                        key={ option } 
                        className={`btn rounded-none h-9 min-h-9 px-3 md:px-4 md:h-10 md:min-h-10 ${ uppercase ? "uppercase": "capitalize" } 
                            ${ fullWidth ? "w-1/2 md:w-auto" : "" } ${ isActive 
                            ? "bg-primary text-primary-dark hover:bg-primary hover:text-primary-dark border-none \
                                dark:bg-primary-dark dark:text-backdrop-dark dark:hover:bg-primary-dark dark:hover:text-backdrop-dark" 
                            : "bg-transparent font-normal text-primary hover:bg-secondaryGrey/[0.25] dark:text-primary-dark" 
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