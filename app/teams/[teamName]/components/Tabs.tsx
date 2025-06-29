'use client';
import Link from "next/link";
import useCurrentPath from '@/app/helpers/getCurrentPath';

export default function Tabs({ teamName }: { teamName: string }) {
  const tabs = ['overview', 'schedule', 'roster', 'statistics'];
  const activeTab = useCurrentPath();

  return (
    <nav className="font-rubik w-full bg-section dark:bg-section-dark mb-11">
        <div className="w-full flex flex-nowrap justify-between overflow-x-auto m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            { tabs.map(tab => {
                const isActiveTab = activeTab === tab;
                        
                return (
                    <Link
                        key={ tab }
                        href={ `/teams/${teamName}/${tab}` }
                        className={`hover:bg-secondaryGrey/[0.25] px-2 lg:px-3.5 py-3 uppercase ${ isActiveTab && 
                                    "font-semibold border-b-2 border-cyan-500 dark:border-cyan-400" } 
                        `}
                    >
                        { tab }
                    </Link>    
                )         
            })}
        </div>
    </nav>
  );
}
