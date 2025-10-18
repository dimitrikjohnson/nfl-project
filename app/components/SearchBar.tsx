'use client';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { Team, Player } from "@/app/types/search";
import getCurrentPath from '../helpers/useCurrentPath';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);

    const onTeamsPage = getCurrentPath() == "teams";

    useEffect(() => {
        if (!query) {
            setPlayers([]);
            setTeams([]);
            return;
        }

        const timeout = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setPlayers(data.players);
                setTeams(data.teams);    
            }
            finally {
                setLoading(false);
            } 
        }, 300); // debounce

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <div className="relative w-full text-sm max-w-sm">
            {/* Mobile trigger */}
            <button 
                className="flex md:hidden"
                onClick={() => {
                    const dialogElement = document.getElementById('searchModal') as HTMLDialogElement;
                    dialogElement.showModal();
                }} 
                aria-label="Open search"
            >
                <FontAwesomeIcon 
                    className="text-lg" 
                    icon={faMagnifyingGlass} 
                    style={{ color: onTeamsPage ? undefined : "#ffffff" }} 
                />
            </button>

            {/* Mobile modal */}
            <dialog id="searchModal" aria-label="Mobile search modal" className="md:hidden modal modal-top">
                <div className="modal-box px-3">
                    <div className="flex justify-between mb-2">
                        <SearchInput query={query} setQuery={setQuery} />
                        <form method="dialog">
                            <button 
                                className="btn btn-sm btn-circle btn-ghost" 
                                onClick={()=> setQuery('')}
                                aria-label="Close search"
                            >
                                ✕
                            </button>
                        </form>    
                    </div>  
                    <SearchResults teams={teams} players={players} query={query} loading={loading} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={()=> setQuery('')}>Close</button>
                </form>
            </dialog>

            {/* Desktop inline */}
            <div className="hidden md:block group">
                <SearchInput onTeamsPage={onTeamsPage} query={query} setQuery={setQuery} />
                <SearchResults
                    teams={ teams }
                    players={ players }
                    query={ query }
                    loading={ loading }
                    className="hidden group-focus-within:block absolute left-0 right-0 bg-alt-table-row border border-gray-300 dark:bg-alt-table-row-dark dark:border-none dark:shadow-lg rounded-md"
                />   
            </div>
        </div>
    );
}