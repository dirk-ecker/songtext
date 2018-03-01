const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const _ = require('lodash');

exports = Object.assign(exports,
    {searchLyrics, searchTitle, createSearchUrl});

const songSearchUrl = 'http://www.songtexte.com/search?c=songs&q=';

function findTitle(document) {
    const foundTitle = document.querySelector('div span.song a span');
    const foundLink = document.querySelector('div span.song a');
    // console.log('findTitle', foundTitle.textContent, foundLink.href);
    return foundTitle ? { title: foundTitle.textContent, link: foundLink.href } :
        { title: undefined, link: undefined };
}

function findArtist(document) {
    const foundArtist = document.querySelector('div span.artist a span');
    const foundLink = document.querySelector('div span.artist a');
    // console.log('foundArtist', foundArtist.textContent, foundLink.href);
    return foundArtist ? { artist: foundArtist.textContent, link: foundLink.href } :
        { artist: undefined, link: undefined };
}

function findLyrics(document) {
    const foundLyrics = document.querySelector('div#lyrics');
    return foundLyrics.textContent;
}

function createSearchUrl(title) {
    const titleEncoded = title.split(' ').join('+');
    return `${songSearchUrl}${titleEncoded}`;
}

function getLyrics(url, callback) {
    JSDOM.fromURL(url)
        .then((dom) => {
            callback(findLyrics(dom.window.document));
        })
        .catch((error) => {
            console.log('Error occured:', error);
        });
}

function searchTitle(title, callback) {
    const url = createSearchUrl(title);
    JSDOM.fromURL(url)
        .then((dom) => {
            const document = dom.window.document;
            const foundTitle = findTitle(document);
            const foundArtist = findArtist(document);
            // console.log(foundTitle, foundArtist);
            callback(foundTitle, foundArtist);
        })
        .catch((error) => {
            console.log('Error occured:', error);
        });
}

function searchLyrics(title, callback) {
    searchTitle(title, (foundTitle, foundArtist) => {
        foundTitle.link ?
            getLyrics(foundTitle.link, (lyrics) => callback(foundTitle.title, foundArtist.artist, lyrics)) :
            callback();
    });
}