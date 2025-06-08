'use client';
import { useSearchParams } from 'next/navigation';
import FilterList from '../../../../components/FilterList';
import TeamStatistics from './TeamStatistics';
import PlayerStatistics from './PlayerStatistics';

export default function Statistics({ teamID, tags }: { teamID: string, tags: string[] }) {
    // gets the 'stats' query from the URL
    const searchParams = useSearchParams();
    const stats = searchParams.get('stats');
    const popupActive = searchParams.has('popupActive');

    return (<>
        { popupActive && <FilterList tags={ tags } teamID={ teamID } isMobile={ true } showTeamColors={ true } query={ 'stats' } /> }
        { stats == "team-stats" || !stats
            ? <TeamStatistics teamID={ teamID }/>
            : <PlayerStatistics teamID={ teamID }/>
        }
    </>)
}