// removes the dashes from query URLs

const unslugifyQuery = (str: string | undefined | false | null) => {
    if (str) {
        return str.replace('-', ' ');  
    }    
    return "all";
}

export default unslugifyQuery;