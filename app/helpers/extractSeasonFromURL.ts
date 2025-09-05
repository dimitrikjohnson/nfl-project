export default function extractSeasonFromURL(url: string) {
    return url.substring(url.lastIndexOf("/")+1, url.indexOf("?"))
}