const expect = require('chai').expect;
const songtext = require('../src/songtext');

describe('songtext', () => {

    it('creates the correct search url', () => {
        expect(songtext.createSearchUrl('enjoy the silence'))
            .equals('http://www.songtexte.com/search?c=songs&q=enjoy+the+silence');
    });

    it('finds the song enjoy the silence', (done) => {
        songtext.searchTitle('enjoy the silence', (title, artist) => {
            expect(title).deep.equals({
                title: 'Enjoy the Silence',
                link: 'http://www.songtexte.com/songtext/depeche-mode/enjoy-the-silence-23d5a46b.html'
            });
            expect(artist).deep.equals({
                artist: 'Depeche Mode',
                link: 'http://www.songtexte.com/artist/depeche-mode-73d6b235.html'
            });
            done();

        });
    });

    it('handles not found lyrics correct', () => {
        expect(songtext.searchLyrics('jahsjkdhfkjasdf', (title, artist, lyrics) => {
            expect(title).is.undefined;
            expect(artist).is.undefined;
            expect(lyrics).is.undefined;
        }));
    });

    it('gets lyrics for enjoy the silence', () => {
        expect(songtext.searchLyrics('enjoy the silence', (title, artist, lyrics) => {
            // console.log(lyrics);
            expect(title).equals('Enjoy the Silence');
            expect(artist).equals('Depeche Mode');
            expect(lyrics.length).equals(524);
        }));
    });


});