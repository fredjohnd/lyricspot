const SpotifyWebHelper = require('spotify-web-helper');
const spotify = SpotifyWebHelper({port:4381});
const ws = require('../services/ws');
const lyricsFetcher = require('../services/lyricsFetcher');

var spotifyIsReady = false;
var currentTrack;
var currentLyrics = {};

var getTrackInformation = function(track) {
    if (!track) return 'No track';
    return track.artist_resource.name + " - " + track.track_resource.name;
}

spotify.player.on('ready', () => {
    console.log('Spotify Ready');
    spotifyIsReady = true;

    spotify.player.on('track-will-change', track => {
        currentTrack = track;

        let trackName = getTrackInformation(track);
        currentTrackName = trackName;
        lyricsFetcher.search(trackName).then(lyrics => {
            currentLyrics = {trackName: trackName, lyrics: lyrics};
            ws.lyricsReceived(currentLyrics);
        }).catch(error => {
            console.log(error);
        })
	});

});

exports.index = (req, res) => {
    res.render('index.pug', {spotifyIsReady: spotifyIsReady, lyrics: {trackName: currentLyrics.trackName, lyrics: currentLyrics.lyrics }});
}
