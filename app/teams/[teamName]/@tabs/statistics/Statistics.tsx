'use client';
import { useSearchParams } from 'next/navigation';
import FilterList from '../../../../components/FilterList';
import TeamStatistics from './TeamStatistics';
import PlayerStatistics from './PlayerStatistics';
import type { AllTeamsColors } from "@/app/types/colors";
import teamColors from "@/app/data/allTeamsColors.json";

export default function Statistics({ teamName, tags }: { teamName: string, tags: string[] }) {
    // gets the 'stats' query from the URL
    const searchParams = useSearchParams();
    const stats = searchParams.get('stats');
    const popupActive = searchParams.has('popupActive');

    const allTeamsColors = teamColors as AllTeamsColors;
    const teamID = allTeamsColors[teamName].id;

    return (<>
        { popupActive && <FilterList tags={ tags } teamName={ teamName } isMobile={ true } showTeamColors={ true } query={ 'stats' } /> }
        { stats == "team-stats" || !stats
            ? <TeamStatistics teamID={ teamID }/>
            : <PlayerStatistics teamID={ teamID }/>
        }
    </>)
}