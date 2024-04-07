const longDate = {
    weekday:"long", 
    month:"long", 
    day:"numeric" 
}

function formatDate(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-us', longDate)
    return formattedDate
}

function formatDateTime(date) {
    const formattedDateTimeLong = new Date(date).toLocaleString('en-us', {...longDate, 
        hour:"numeric", 
        minute:"numeric", 
        timeZoneName:"short"
    })

    const formattedDateTimeShort = new Date(date).toLocaleString('en-us', { 
        weekday:"short", 
        month:"short", 
        day:"numeric", 
        hour:"numeric", 
        minute:"numeric",
    })

    // send multiple options for different screen sizes
    return {
        long: formattedDateTimeLong,
        short: formattedDateTimeShort
    }
}

export { formatDate, formatDateTime }