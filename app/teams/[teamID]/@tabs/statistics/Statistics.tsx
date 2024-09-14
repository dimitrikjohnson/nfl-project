'use client';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FilterList from '../../../../components/FilterList';
import TeamStatistics from './TeamStatistics';
import PlayerStatistics from './PlayerStatistics';

// dynamically import the components so they are only downloaded when they're needed
//const DynamicTeamStatistics = dynamic(() => import('./TeamStatistics'))
//const DynamicPlayerStatistics = dynamic(() => import('./PlayerStatistics'))

export default function Statistics({ teamID, tags }) {
    // gets the 'stats' query from the URL
    const searchParams = useSearchParams();
    const stats = searchParams.has('stats') && searchParams.get('stats');
    const popupActive = searchParams.has('popupActive');

    return (<>
        { popupActive && <FilterList tags={ tags } teamID={ teamID } isMobile={ true } showTeamColors={ true } query={ 'stats' } /> }
        { stats == "team-stats" || !stats
            ? <TeamStatistics teamID={ teamID }/>
            : <PlayerStatistics teamID={ teamID }/>
        }
    </>)
}