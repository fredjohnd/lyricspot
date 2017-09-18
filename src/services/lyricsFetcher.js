const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = "https://search.azlyrics.com/search.php?q="

exports.search = (track) => {
    return fetchUrl(url + encodeURI(track))
    .then(html => {
        let $ = cheerio.load(html);
        const lyricsUrl = $('.table tr td.text-left a').attr('href');
        if (!lyricsUrl) {
            return "No Lyric found on AZLYRICS for " + track;
        }
        return fetchUrl(lyricsUrl).then(lyrics => {
            let $ = cheerio.load(lyrics);
            return $('.main-page > .row > .text-center:not(.noprint) > div:not([class])').text();
        });
    });
};

const fetchUrl = (url) => {
    return fetch(url)
    .then(res => res.text())
    .then(html => html);
}