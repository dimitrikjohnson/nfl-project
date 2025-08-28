'use client';
import { useState } from "react";
import { PlayerOverview } from "@/app/types/player";
import getInjuryColor from "@/app/helpers/getInjuryColor";
import H3 from "@/app/components/H3";
import { formatDateTime } from "@/app/helpers/dateFormatter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faBan, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

export default function InjuryStatus({ injury }: { injury: PlayerOverview["injury"] }) {
    const [showMore, setShowMore] = useState(false);
    const labelClasses = "xl:w-28 text-gray-500 dark:text-lighterSecondaryGrey uppercase";
    const dataContainerClasses = "flex gap-1.5 mb-3 last-of-type:m-0";

    function displayStatusIcon(statusAbbreviation: string | undefined) {
        if (statusAbbreviation == "Q") { return <FontAwesomeIcon icon={faCircleQuestion} className="" /> }
        if (statusAbbreviation == "SUSP" || statusAbbreviation == "O") { return <FontAwesomeIcon icon={faBan} className="" /> }
        if (statusAbbreviation == "IR") { return <FontAwesomeIcon icon={faCirclePlus} className="" /> }
    }

    return (
        <section className="mb-9 md:mb-7">
            <H3>Injury Status</H3>
            <div className="bg-section border border-gray-300 dark:bg-section-dark dark:border-none text-sm pb-3 rounded-md">
                <div 
                    className={`flex gap-1.5 justify-center items-center font-bold text-stone-950 p-1 mb-3 rounded-t-md ${ getInjuryColor(injury?.abbreviation) }`}
                >
                    { displayStatusIcon(injury?.abbreviation)}
                    { injury?.status }  
                </div>
                <div className="px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:block mb-3 xl:mb-6">
                        <p className={ dataContainerClasses }>
                            <label className={ labelClasses }>Type:</label>
                            <span>{ injury?.type }</span>
                        </p>
                        { injury?.location &&
                            <p className={ dataContainerClasses }>
                                <label className={ labelClasses }>Location:</label>
                                <span>{ injury?.location }</span>
                            </p>
                        }
                        { injury?.detail &&
                            <p className={ dataContainerClasses }>
                                <label className={ labelClasses }>Detail:</label>
                                <span>{ injury?.detail }</span>
                            </p>
                        }
                        <p className={`${dataContainerClasses} sm:col-span-2 lg:col-span-1`}>
                            <label className={labelClasses}>Est. Return:</label>
                            <span className="lg:hidden">{ formatDateTime(injury?.returnDate).shortNoTime }</span>
                            <span className="hidden lg:block">{ formatDateTime(injury?.returnDate).noTime }</span>
                        </p>    
                    </div>
                    <div>
                        <div className="flex border-b border-primary dark:border-primary-dark pb-2 mb-3 justify-between items-end">
                            <p className="font-bold">Comment</p>
                            <p className="text-xs text-gray-500 dark:text-lighterSecondaryGrey italic">via Rotowire</p>
                        </div>              
                        <p className="leading-6">
                            <span className="text-gray-500 dark:text-lighterSecondaryGrey">
                                { formatDateTime(injury?.updateDate).noTime } -
                            </span> 
                            <span className="mr-2"> { showMore ? injury?.comment : `${ (injury?.comment)?.substring(0, 200) }...` }</span>
                            <button 
                                className="text-blue-800 dark:text-cyan-400 hover:underline" 
                                onClick={() => setShowMore(!showMore)}
                            >
                                { showMore ? "Show less" : "Show more" }
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </section>  
    )
}