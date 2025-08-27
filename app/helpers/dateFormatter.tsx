function formatDateTime(date?: string | Date) {  
    // if date is undefined for some reason
    if (!date) {
        return {
            short: "TBD",
            long: "TBD",
            scoreboard: "TBD",
            noTime: "TBD"
        };
    }

    const formattedDateTimeShort = new Date(date).toLocaleString('en-us', {
        month:"numeric", 
        day:"numeric",
        hour:"numeric", 
        minute:"numeric"
    });

    const formattedDateShortWithoutTime = new Date(date).toLocaleString('en-us', {
        month:"numeric", 
        day:"numeric",
        year:"numeric"
    });
    
    const formattedDateTimeLong = new Date(date).toLocaleString('en-us', { 
        weekday:"short", 
        month:"short", 
        day:"numeric", 
        hour:"numeric", 
        minute:"numeric",
    });

    const formattedDateTimeScoreboard = new Date(date).toLocaleString('en-us', { 
        timeZone:"America/New_York",
        weekday:"short", 
        hour:"numeric", 
        minute:"numeric",
    });

    const formattedDateWithoutTime = new Date(date).toLocaleString('en-us', { 
        month:"short", 
        day:"numeric", 
        year:"numeric",
    });

    // send multiple options for different screen sizes (+ the scoreboard and no time versions)
    return {
        short: formattedDateTimeShort,
        shortNoTime: formattedDateShortWithoutTime,
        long: formattedDateTimeLong,
        scoreboard: formattedDateTimeScoreboard,
        noTime: formattedDateWithoutTime
    }
}

export { formatDateTime }