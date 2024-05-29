//import React from 'react'
//import ListOfTeams from '../components/ListOfTeams'
//import getAllTeams from '../apiCalls/getAllTeams';
import allTeams from '../formatAPIcalls/allTeams';
//import TeamCard from '../components/TeamCard';
import SuperBowlWinnerProvider from '../contextProviders/sbWinnerProvider'
import CurrentSeasonProvider from '../contextProviders/currentSeasonProvider';
import TeamProvider from '../contextProviders/teamProvider';
import FilterTeams from '../components/FilterTeams';

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
        <section className="xl:m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            <FilterTeams teams={ teams } />    
        </section>
    )
}

export default ListOfTeamsPage
