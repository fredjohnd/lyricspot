const SpotifyWebHelper = require('spotify-web-helper');
const spotify = SpotifyWebHelper();
const ws = require('../services/ws');
const lyricsFetcher = require('../services/lyricsFetcher');

var currentTrack;
var currentTrackName;
var currentLyrics = 'Searching for spotify..';

var getTrackInformation = function(track) {
    if (!track) return 'No track';
    return track.artist_resource.name + " - " + track.track_resource.name;
}

spotify.player.on('ready', () => {
    console.log('Spotify Ready');

    spotify.player.on('track-will-change', track => {
        currentTrack = track;

        let trackName = getTrackInformation(track);
        currentTrackName = trackName;
        lyricsFetcher.search(trackName).then(lyrics => {
            currentLyrics = lyrics;
            ws.lyricsReceived(lyrics);
        })
	});

});

exports.index = (req, res) => {
    res.render('index.pug', { title: 'Lyricspot', trackName: currentTrackName, lyrics: currentLyrics });
}
