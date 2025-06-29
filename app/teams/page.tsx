import { Suspense } from 'react';
import FilterTeams from '@/app/teams/components/FilterTeams';
import NavBar from '@/app/components/NavBar';
import getAllTeams from '@/app/apiCalls/getAllTeams';

const ListOfTeamsPage = async () => {
    const teams = await getAllTeams();
    
    return (
        <>
            <NavBar />
            <section className="mt-12 px-4 pt-10 md:px-6 lg:px-14 xl:mx-auto max-w-screen-xl">
                <Suspense fallback={<div className="skeleton w-full h-24"></div>}>
                    <FilterTeams teams={ teams } />
                </Suspense>    
            </section>
        </>  
    )
}

export default ListOfTeamsPage
