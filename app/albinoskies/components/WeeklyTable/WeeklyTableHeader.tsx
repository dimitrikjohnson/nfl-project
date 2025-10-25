// header for the Albino Skies tables
export default function WeeklyTableHeader({ weeks, extraHeaders }: { weeks: number[]; extraHeaders?: React.ReactNode; }) {
    return (
        <thead className="border-b border-secondaryGrey">
            <tr>
                <th 
                    className="py-2.5 px-2 md:px-3 text-start border-r border-secondaryGrey bg-section dark:bg-section-dark"
                    style={{ // add explicit stickiness for mobile (wasn't working with Tailwind sticky)
                        position: "sticky",
                        left: 0,
                        zIndex: 20,
                    }}
                >
                    User
                </th>
                { weeks.map((week) => (
                    <th key={week} className="py-2.5 px-2 md:px-3 text-center">
                        Week {week}
                    </th>
                ))}
                { extraHeaders }
            </tr>
        </thead>
    );
}
