/*
 * Formulas for calculating fantasy points

 * points for passing yards = numOfYards * 0.04 (1 point for every 25 yards)
 * points for passing touchdowns = numOfTds * 4 (4 points for 1 touchdown)
 * points for interceptions = -1 point for 1 interception
 
 * points for rushing yards = numOfYards * 0.1 (1 point for every 10 yards)
 * points for rushing touchdowns = numOfTds * 6 (6 points for 1 touchdown)
 
 * points for receptions = numOfReceptions * 0.5 (1 point for every 2 catches)
 * points for receiving yards = numOfYards * 0.1 (1 point for every 10 yards)
 * points for receiving touchdowns = numOfTds * 6 (6 points for 1 touchdown)
 * 
 * points for 2 point conversions = numOfConversions * 2 (2 points for 1 conversion)
 * points for fumbles = numOfFumbles * 2 (-2 points for 1 fumble)
*/

const passingYardPoints = 0.04;
const passingTDPoints = 4;
const rushingYardPoints = 0.1;
const rushingTDPoints = 6;

export function calculateYearFantasyPoints(data: any) {
    // passing
    const passingCategory = findStat("passing", data);
    const passingYards = findStat("passingYards", passingCategory, true);
    const passingTD = findStat("passingTouchdowns", passingCategory, true);
    const interceptions = findStat("interceptions", passingCategory, true);
        
    // rushing
    const rushingCategory = findStat("rushing", data);
    const rushingYards = findStat("rushingYards", rushingCategory, true);
    const rushingTD = findStat("rushingTouchdowns", rushingCategory, true);
    
    // receiving
    const receivingCategory = findStat("receiving", data);
    const receptions = findStat("receptions", receivingCategory, true);
    const receivingYards = findStat("receivingYards", receivingCategory, true);
    const receivingTD = findStat("receivingTouchdowns", receivingCategory, true);
    
    // 2 point conversions
    const scoringCategory = findStat("scoring", data);
    const twoPointConvs = findStat("totalTwoPointConvs", scoringCategory, true);
    
    // fumbles
    const generalCategory = findStat("general", data);
    const fumblesLost = findStat("fumblesLost", generalCategory, true);
    
    const halfPPR = 
        (passingYards ?? 0) * passingYardPoints + 
        (passingTD ?? 0) * passingTDPoints + 
        (interceptions ?? 0) * -1 +
        (rushingYards ?? 0) * rushingYardPoints +
        (rushingTD ?? 0) * rushingTDPoints +
        (receptions ?? 0) * 0.5 +
        (receivingYards ?? 0) * 0.1 +
        (receivingTD ?? 0) * 6 +
        (fumblesLost ?? 0) * -2 +
        (twoPointConvs ?? 0) * 2;
        
    const ppr = halfPPR + ((receptions ?? 0) * 0.5);

    return {
        "halfPPR": Number.isInteger(halfPPR) ? halfPPR : halfPPR.toFixed(2),
        "ppr": Number.isInteger(ppr) ? ppr : ppr.toFixed(2)
    }
}

// find each statistic in the "haystack" given
// i use find() instead of exact positions in case the data is in different places for some players 
export function findStat(needle: any, haystack: any, returnValue?: boolean, displayValue?: boolean) {
    if (returnValue) {
        const category = haystack?.stats.find(
            (stat: { name: string; }) => stat.name == needle
        );

        return displayValue ? category?.displayValue : category?.value;
    }
    
    return haystack?.splits?.categories.find(
        (stat: { name: string; }) => stat.name == needle
    );
}

export function calculateGameFantasyPoints(gameStats: any, names: string[]) {
    // Create a stat object mapping each name to its value
    const stats: { [name: string]: number } = {};
    
    names.forEach((name, index) => {
        stats[name] = Number(gameStats[index].replace(",", '')); // convert all values to Number and remove any commas
    });

    // Apply fantasy scoring rules
    // if any values are null or undefined, return 0
    const halfPPR = 
        (stats.passingYards ?? 0) * passingYardPoints + 
        (stats.passingTouchdowns ?? 0) * passingTDPoints + 
        (stats.interceptions ?? 0) * -1 +
        (stats.rushingYards ?? 0) * rushingYardPoints +
        (stats.rushingTouchdowns ?? 0) * rushingTDPoints +
        (stats.receptions ?? 0) * 0.5 +
        (stats.receivingYards ?? 0) * 0.1 +
        (stats.receivingTouchdowns ?? 0) * 6 +
        (stats.fumblesLost ?? 0) * -2;

    const ppr = halfPPR + ((stats.receptions ?? 0) * 0.5);

    return {
        "halfPPR": halfPPR.toFixed(2).toString(),
        "ppr": ppr.toFixed(2).toString()
    }
}