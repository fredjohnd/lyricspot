var io;

exports.setIo = (socketio) => {
    io = socketio;
}
exports.lyricsReceived = (lyrics) => {
    io.emit('lyric_received', lyrics);
}