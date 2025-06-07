// formats the query URLs when divisions are selected on /teams

const formatDivisionQuery = (str: string | undefined | false | null) => {
    if (!str) return "all"; 
    
    const seperatedStr = str.replace('-', ' ').split(' ');
        
    return (
        <>
            { seperatedStr.map(strPart =>
                <span key={ strPart } className="first-of-type:uppercase last-of-type:capitalize">{ strPart }</span>
            )}
        </>
    )
}

export default formatDivisionQuery;