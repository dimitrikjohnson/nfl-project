// header for the Albino Skies tables
export default function WeeklyTableHeader({ weeks, extraHeaders }: { weeks: number[]; extraHeaders?: React.ReactNode; }) {
    return (
        <thead className="border-b border-secondaryGrey">
            <tr>
                <th className="sticky left-0 z-10 py-2.5 px-2 md:px-3 text-start border-r border-secondaryGrey bg-section dark:bg-section-dark">
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
