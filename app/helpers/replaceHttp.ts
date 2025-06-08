// replace http with https to fix 'Blocked loading mixed active content' on production

export default function replaceHttp(url: string) {
    return url.replace("http", "https");
}