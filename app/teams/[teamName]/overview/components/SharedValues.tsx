// component for the shared labels and values between LastTwoGames and NextTwoGames

import { formatDateTime } from "@/app/helpers/dateFormatter";
import { displayHomeAway } from "@/app/helpers/displayGameInfo";

export default function SharedValues(res: any) {
    const labelClasslist = "uppercase text-gray-500 dark:text-lighterSecondaryGrey mr-2";

    return (
        <>
            <div className="pb-3">
                { displayHomeAway(res.game.teams, res.teamID, true) }
            </div>
            <dl className="flex pb-2">
                <dt className={ labelClasslist }>Date:</dt>
                <dd className="md:hidden">{ formatDateTime(res.game.date).short }</dd>
                <dd className="hidden md:inline-block">{ formatDateTime(res.game.date).long }</dd>
            </dl>
            <dl className="flex pb-2">
                <dt className={ labelClasslist }>Type:</dt>
                <dd className="hidden md:inline-block">{ res.game.seasonType.name }</dd>
                <dd className="inline-block md:hidden capitalize">{ res.game.seasonType.abbreviation }</dd>
            </dl>
            <dl className="flex pb-2">
                <dt className={ labelClasslist }>Week:</dt>
                <dd>{ res.game.week }</dd>
            </dl>
        </>
    )
}