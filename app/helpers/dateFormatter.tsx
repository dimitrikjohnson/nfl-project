function formatDateTime(date) {  
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

    // send multiple options for different screen sizes
    return {
        short: formattedDateTimeShort,
        long: formattedDateTimeLong
    }
}

export { formatDateTime }