const fetch = require('node-fetch');
const cheerio = require('cheerio');

var Promise = require('promise');
const url = "https://search.azlyrics.com/search.php?q="

const instructions = [
    {
        action: 'fetch',
        url: 'https://search.azlyrics.com/search.php?q={query}'
    },
    {
        action: 'element',
        value: '.table tr td.text-left a'
    },
    {
        action: 'attribute',
        value: 'href'
    },
    {
        action: 'fetch',
        value: '{previous}'
    },
    {
        action: 'element',
        value: '.main-page > .row > .text-center:not(.noprint) > div:not([class])'
    }
]

// const actions = {
//     fetch: 'fetchUrl', 
//     element: 'selectElement', 
//     attribute: 'getAttribute'
// };

exports.search = (track) => {

    return fetchUrl(url + encodeURI(track))
    .then(html => {
        return selectElement(html, '.table tr td.text-left a').then(result => {
            return getAttribute(result, 'href').then(attribute => {
                return fetchUrl(attribute).then(result => {
                    return selectElement(result, '.main-page > .row > .text-center:not(.noprint) > div:not([class])').then(result => {
                        return result.text();
                    })
                })
            })
        })
        // let $ = cheerio.load(html);
        // const lyricsUrl = $('.table tr td.text-left a').attr('href');
        // if (!lyricsUrl) {
        //     return "No Lyric found on AZLYRICS for " + track;
        // }
        // return fetchUrl(lyricsUrl).then(lyrics => {
        //     let $ = cheerio.load(lyrics);
        //     return $('.main-page > .row > .text-center:not(.noprint) > div:not([class])').text();
        // });
    });
};

const fetchUrl = (url, query) => {
    url = url.replace('{query}', query);
    return fetch(url)
    .then(res => res.text())
    .then(html => html);
}

const selectElement = (data, selector, asText) => {
    return new Promise((fulfill, reject) => {
        let $ = cheerio.load(data);
        let element = $(selector).eq(0);
        return asText ? fulfill(element.text()) : fulfill(element);
    });
}

const getAttribute = (element, attr) => {
    return new Promise((fulfill, reject) => {
        const value = element.attr(attr);
        if (value) fulfill(value);
        else reject();
    });
}