import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

type Props = {
    query: string;
    setQuery: (q: string) => void;
    onTeamsPage?: boolean;
};

export function SearchInput({ query, setQuery, onTeamsPage }: Props) {
    return (
        <div 
            role="search"        
            aria-label="Search for teams or active players"     // <- Descriptive label for screen readers
            className={`flex items-center w-full border-2 rounded-md px-2 h-8 border-primary dark:border-primary-dark ${!onTeamsPage && "md:border-primary-dark"} focus-within:outline`}
        >
            <label 
                id="search-label" 
                className={`mr-1.5 ${!onTeamsPage && "text-primary dark:text-primary-dark md:text-primary-dark"}`}
            >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <span className="sr-only">Search</span>
            </label> 
            <input
                type="text"
                aria-labelledby="search-label"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`bg-transparent placeholder:text-primary/90 dark:placeholder:text-primary-dark/90 ${!onTeamsPage && "md:placeholder:text-primary-dark/90"} outline-none`}
            />
        </div>
    );
}
