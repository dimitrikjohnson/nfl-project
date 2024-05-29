const formatTeamData = (data) => {
    return {
        id: data.id,
        abbreviation: data.abbreviation,
        location: data.location,
        name: data.name,
        displayName: data.displayName,
        conference: data.groups.id,
        logo: (data.shortDisplayName == 'Giants' || 'Jets') ? data.logos[1].href : data.logos[0].href,
        record: data.record.items?.[0].summary,
        standingSummary: data.standingSummary
    }
}

export default formatTeamData;