import Statistics from "@/app/teams/[teamName]/@tabs/statistics/Statistics";
import FilterList from '@/app/components/FilterList';
import FilterDropdownButton from '@/app/components/FilterDropdownButton';

export default function StatisticsHome({ teamName }: { teamName: string }) {
    const tags = ["team stats", "player stats"];
    
	return (<>
        <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2 border-primary dark:border-primary-dark">
            <h2 className="font-protest text-3xl 2xl:text-4xl uppercase">Statistics</h2>
            <div className="font-rubik flex">
                <FilterDropdownButton />
                <FilterList tags={ tags } teamName={ teamName } isMobile={ false } showTeamColors={ true } query={ 'stats' } />
            </div>
        </div>
        <Statistics teamName={ teamName } tags={ tags } />
    </>)	
}  