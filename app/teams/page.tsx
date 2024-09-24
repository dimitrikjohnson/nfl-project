import allTeams from '../formatAPIcalls/allTeams';
import FilterTeams from '../components/FilterTeams';
import NavBar from '../components/NavBar';

interface Team {
    id: string;
    location: string;
    displayName: string;
    logo: string;
    record: string;
    standingSummary: string;
}

const ListOfTeamsPage = async () => {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams", {
        method: "GET"
    });

    const data = await res.json();
    const teams: Team[] = await allTeams(data);
    
    return (
        <>
            <NavBar team={ {} } />
            <section className="mt-20 px-4 md:px-6 lg:px-14 xl:mx-auto max-w-screen-xl">
                <FilterTeams teams={ teams } />    
            </section>
        </>  
    )
}

export default ListOfTeamsPage
