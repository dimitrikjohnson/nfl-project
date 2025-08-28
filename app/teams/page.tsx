import { Suspense } from 'react';
import FilterTeams from '@/app/teams/components/FilterTeams';
import NavBar from '@/app/components/NavBar';
import getAllTeams from '@/app/apiCalls/getAllTeams';
import Link from 'next/link';

const ListOfTeamsPage = async () => {
    const teams = await getAllTeams();
    
    return (
        <>
            <Link 
				className="absolute left-0 top-0 block z-50 -translate-x-full rounded-md bg-cyan-400 text-backdrop-dark px-4 py-3 text-sm font-bold uppercase tracking-wide focus-visible:translate-x-0" 
				href="#content">
					Skip to content
			</Link>
            <NavBar />
            <main id="#content" className="mt-12 px-4 pt-10 md:px-6 lg:px-14 xl:mx-auto max-w-screen-xl">
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <FilterTeams teams={ teams } />
                </Suspense>    
            </main>
        </>  
    )
}

export default ListOfTeamsPage
