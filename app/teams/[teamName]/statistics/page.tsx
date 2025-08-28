import Statistics from "@/app/teams/[teamName]/statistics/components/Statistics";
import FilterList from '@/app/components/FilterList';
import FilterDropdownButton from '@/app/components/FilterDropdownButton';
import H2 from "@/app/components/H2";

export default async function StatisticsTab({ params }: { params: Promise<{ teamName: string }>}) {
    const { teamName } = await params;
    const tags = ["team stats","player stats"];
    
	return (<>
        <div className="flex justify-between pb-2 mb-4 md:mb-9 border-b-2 border-primary dark:border-primary-dark">
            <H2>Statistics</H2>
            <div className="flex">
                <FilterDropdownButton />
                <FilterList tags={ tags } teamName={ teamName } isMobile={ false } showTeamColors={ true } query={ 'stats' } />
            </div>
        </div>
        <Statistics teamName={ teamName } tags={ tags } />
    </>)	
}  