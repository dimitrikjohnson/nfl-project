'use client';
import Link from "next/link";
import useCurrentPath from '@/app/helpers/useCurrentPath';

export default function Tabs({ tabs, url }: { tabs: string[]; url: string }) {
  const activeTab = useCurrentPath();

  return (
    <nav className="w-full bg-section dark:bg-section-dark mb-11">
        <div className="w-full flex flex-nowrap justify-between overflow-x-auto m-auto px-4 md:px-6 lg:px-14 max-w-screen-xl">
            { tabs.map(tab => {
                const isActiveTab = activeTab === tab;
                        
                return (
                    <Link
                        key={ tab }
                        href={ `${url}/${tab}` }
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
