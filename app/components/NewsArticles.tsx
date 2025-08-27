import { Fragment } from 'react';
import { getLeagueNews, getPlayerNews, getTeamNews } from "@/app/apiCalls/getNews";
import Link from "next/link";

type NewsArticle = {
    id: string;
    title: string;
    link: string;
    date: string;
    image: {
        url: string;
        alt: string;
    };
    byline: string;
}

type PageTypes = "league" | "teamFull" | "teamOverview" | "playerFull" | "playerOverview";

export default async function NewsArticles({ type, id, playerSlug }:{ type: PageTypes, id?: string, playerSlug?:string }) {
    let news;
    
    if (type == "league") { news = await getLeagueNews(); }

    else if ((type == "teamFull" || type == "teamOverview") && id) { 
        news = await getTeamNews(id); 
    }
    else if ((type == "playerFull" || type == "playerOverview") && id) { 
        news = await getPlayerNews(id); 
    }
    
    if (news == undefined || news.length == 0) {
        // if there's no news and is an Overview page, don't return anything
        if (type.includes("Overview")) return undefined; 

        return <p className="font-bold text-lg text-center">There is no news available.</p>
    }

    const showMoreNewsLink = type.includes("Overview") && news.length > 3;

    // Latest News heading should only appear on league homepage and Overview pages (when news is present)
    return (
        <>
            { !type.includes("Full") &&
                <div className={`${showMoreNewsLink && "flex items-end justify-between"} pb-3`}>
                    <h3 className="font-protest text-2xl lg:text-3xl">Latest News</h3>
                    { showMoreNewsLink &&
                        <Link href={`/player/${playerSlug}/news`} className="text-sm lg:text-base text-blue-800 dark:text-cyan-400 hover:underline">
                            More news
                        </Link>
                    }  
                </div>      
            }   
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${ type != "playerOverview" && "xl:grid-cols-4" } gap-7`}>
                { loopThroughNews(news, type) }
            </div>
        </>
    )
}

function loopThroughNews(news: NewsArticle[], type: PageTypes) {
    const items = [];
    const containerStyling = "bg-section border border-gray-300 dark:bg-section-dark dark:border-none pb-3 rounded-md";

    for (const [index, article] of news.entries()) {
        // only show 3 articles (at most) on overview pages
        if (type.includes("Overview") && index == 3) {
            break;    
        } 

        const content = article.link ? (
            <Link 
                href={ article.link } 
                target="_blank"
                title="(opens in new tab)"
                className={`${containerStyling} group transition ease-in-out delay-50 hover:-translate-y-2`}
            >
                { getArticleBody(article, type) }
            </Link>
        ) : (
            <div className={ containerStyling }>
                { getArticleBody(article, type) }
            </div>
        );
        
        items.push(
            <Fragment key={ index }>
                { content }
            </Fragment>
        );
    }

    return items;
}

function getArticleBody(article: NewsArticle, type: PageTypes) {
    const padding = "px-3 last:pb-0";
    const titleStyling = `font-bold ${padding} group-hover:text-blue-800 dark:group-hover:text-cyan-400`;

    return (
        <>
            { article.image.url &&
                <img src={ article.image.url } className="w-full rounded-t-md before:text-sm" alt={ article.image.alt } />
            }
            <p className={`pt-3 text-sm text-gray-500 dark:text-lighterSecondaryGrey ${padding} pb-1`}>
                { article.date }
            </p>                  
            { type == "playerOverview" 
                ? <h4 className={ titleStyling }>{ article.title }</h4>
                : <h3 className={ titleStyling }>{ article.title }</h3>
            }
            { article.byline &&
                <p className={`text-sm text-gray-500 dark:text-lighterSecondaryGrey ${padding} pt-5`}>
                    By: { article.byline }
                </p>
            }
        </>
    )
}