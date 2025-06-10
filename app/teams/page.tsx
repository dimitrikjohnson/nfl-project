import { Suspense } from 'react';
import allTeams from '../formatAPIcalls/allTeams';
import FilterTeams from '../components/FilterTeams';
import NavBar from '../components/NavBar';
import { Team } from '@/app/types/team';

const ListOfTeamsPage = async () => {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams", {
        method: "GET"
    });

    const data = await res.json();
    const teams: Team[] = await allTeams(data);
    
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
