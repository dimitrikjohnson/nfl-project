// individual rows in Albino Skies tables
import { User } from "@/app/types/albinoskies";

interface WeeklyTableRowProps {
    user: User;
    index: number;
    recordMode: string;
    weeks: number[];
    children: React.ReactNode;
}

export default function WeeklyTableRow({ user, index, recordMode, children }: WeeklyTableRowProps) {
    const record = recordMode === "without median" ? user.record : user.recordWithMedian;
    const recordText = `${record.wins}-${record.losses}`;
    
    // find even/odd rows for sticky column styling
    const isOdd = index % 2 === 0;
    const rowBg = isOdd
        ? "bg-alt-table-row dark:bg-alt-table-row-dark"
        : "bg-section dark:bg-section-dark";

    return (
        <tr className="border-b border-gray-900/20 last-of-type:border-none odd:bg-alt-table-row odd:dark:bg-alt-table-row-dark dark:border-none">
            <td 
                className={`py-2.5 px-2 md:px-3 border-r border-secondaryGrey ${rowBg}`}
                style={{ // add explicit stickiness for mobile (wasn't working with Tailwind sticky)
                    position: "sticky",
                    left: 0,
                    zIndex: 20,
                }}
            >
                <span className="mr-1 md:mr-1.5">{user.name}</span>
                <span key={`${recordMode}-${user}`} className="text-xs text-gray-600 dark:text-lighterSecondaryGrey opacity-0 animate-fadeIn">
                    { recordText }
                </span>
            </td>
            { children }
        </tr>
    );
}
