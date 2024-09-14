'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export default function FilterDropdownButton() {
    const router = useRouter();
    const pathname = usePathname();
    // gets the query from the URL
    const searchParams = useSearchParams();
    //const popupActive = searchParams.has('popupActive');
    
    const handleClick = () => {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        //console.log(params)
        params.get('popupActive') ? params.delete('popupActive') : params.set('popupActive', 'true');

        // cast to string
        const search = params.toString();
        const query = search ? `?${search}` : "";

        router.replace(`${pathname}${query}`);
    };
    
    return (
        <button 
            tabIndex={0} 
            role="button" 
            className="flex md:hidden border border-secondaryGrey/[.50] hover:bg-secondaryGrey/[0.25] btn h-10 min-h-10 rounded-md"
            onClick={ () => handleClick() }
        >
            <span>Filters</span>
            <FontAwesomeIcon icon={faCaretDown} />
        </button>
    )
}