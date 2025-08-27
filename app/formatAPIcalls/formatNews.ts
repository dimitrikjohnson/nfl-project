import { formatDateTime } from "@/app/helpers/dateFormatter";

export default function formatNews(newsFeed: any) {
    const output = [];

    for (const article of newsFeed) {
        // skip the article if it doesn't have "publishedkey" (aka the API response doesn't include a link to the original article)
        //if (article.publishedkey == undefined) { continue; }
        //console.log(article.publishedkey)
        const hasPublishedKey = article.publishedkey != undefined;
        
        output.push({
            id: article.id, // for JSX key
            title: article.headline,
            link: article.links.web?.href,
            date: formatDateTime(article.lastModified).noTime,
            //description: hasPublishedKey && article.description,
            image: {
                url: article.images[0]?.url,
                alt: article.images[0]?.alt
            },
            byline: article.byline
        })
    }

    return output;
}