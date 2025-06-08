function formatDateTime(date?: string | Date) {  
    // if date is undefined for some reason
    if (!date) {
        return {
            short: "TBD",
            long: "TBD",
            scoreboard: "TBD"
        };
    }

    const formattedDateTimeShort = new Date(date).toLocaleString('en-us', {
        month:"numeric", 
        day:"numeric",
        hour:"numeric", 
        minute:"numeric"
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

    // send multiple options for different screen sizes (and the scoreboard)
    return {
        short: formattedDateTimeShort,
        long: formattedDateTimeLong,
        scoreboard: formattedDateTimeScoreboard
    }
}

export { formatDateTime }