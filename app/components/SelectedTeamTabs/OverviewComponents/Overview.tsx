import 'client-only';
import { useContext } from 'react';
import TeamLeaders from './TeamLeaders';
import TeamRankings from './TeamRankings';
import LastTwoGames from './LastTwoGames';
import NextTwoGames from './NextTwoGames';
import { ThisSeason } from '@/app/page';

export default function Overview({ teamID }) {
    const currentSeason = useContext(ThisSeason);

    return (
        <>
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase pb-2 mb-9 border-b-2">{ currentSeason } overview</h2>
            <TeamLeaders teamID={ teamID } responseType={ "overview" }/>
            <TeamRankings teamID={ teamID } />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <LastTwoGames teamID={ teamID }/>
                <NextTwoGames teamID={ teamID } />
            </div>
        </>
    )
}