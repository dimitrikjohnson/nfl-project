'use client';

type FantasyType = 'half-ppr' | 'ppr';

type FantasyTypeToggleProps = {
    fantasyType: FantasyType;
    onChange: (type: FantasyType) => void;
}

// toggle buttons for switching between half-ppr/ppr on player pages
export default function FantasyTypeToggle({ fantasyType, onChange }: FantasyTypeToggleProps) {
    const fantasyTypes: FantasyType[] = ["half-ppr", "ppr"];

    return (
        <div className="flex gap-2.5 md:gap-3">
            { fantasyTypes.map(type =>
                <button 
                    key={ type } 
                    className={`btn h-8 min-h-8 px-3.5 md:px-4 md:h-10 md:min-h-10 dark:border-none uppercase ${ fantasyType == type 
                        ? "bg-primary text-primary-dark hover:bg-primary hover:text-primary-dark border-none \
                            dark:bg-primary-dark dark:text-backdrop-dark dark:hover:bg-primary-dark dark:hover:text-backdrop-dark" 
                        : "bg-alt-table-row text-primary border border-gray-300 hover:bg-secondaryGrey/[0.25] \
                            dark:border-none dark:bg-alt-table-row-dark dark:text-primary-dark" 
                    }`}
                    onClick={ () => onChange(type) }
                >
                    { type }
                </button> 
            )}   
        </div>
    )
}