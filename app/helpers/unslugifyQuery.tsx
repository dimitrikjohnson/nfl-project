// removes the dashes from query URLs
const unslugifyQuery = (str, division = false) => {
    if (str) {
        const newStr = str.replace('-', ' ');
        
        // division is true for the filter on the /teams page
        if (division) {
            const seperatedStr = newStr.split(" ");
            return (
                <>
                    { seperatedStr.map(strPart =>
                        <span key={ strPart } className="first-of-type:uppercase last-of-type:capitalize">{ strPart }</span>
                    )}
                </>
            )
        }
        return newStr; 
    }    
    return "all";
}

export default unslugifyQuery;