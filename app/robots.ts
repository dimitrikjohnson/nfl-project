import type { MetadataRoute } from "next";

/*
 * Crawlers that bring little or no traffic to this site but crawl it heavily.
 * Well-behaved bots obey robots.txt; scrapers that ignore it have to be blocked with Vercel's Firewall instead.
*/
const blockedBots = [
    "Baiduspider",          // Baidu (China)
    "Bytespider",           // ByteDance / TikTok
    "PetalBot",             // Huawei
    "Sogou web spider",
    "YisouSpider",
    "AhrefsBot",            // SEO tools
    "SemrushBot",
    "MJ12bot",
    "DotBot",
    "DataForSeoBot",
    "GPTBot",               // AI training crawlers
    "CCBot",
    "ClaudeBot",
    "Amazonbot",
    "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // API routes are only used by the site's own pages
                disallow: "/api/",
            },
            {
                userAgent: blockedBots,
                disallow: "/",
            },
        ],
    };
}
