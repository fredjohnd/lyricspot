const pug = require('pug');

var express = require('express');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

const indexController = require('./controllers/index');
const ws = require('./services/ws');

app.set('view engine', 'pug')
ws.setIo(io);

app.use(express.static(path.join(__dirname, '../', 'public')));

// Routes
app.get('/', indexController.index);

io.on('connection', function(socket){
  console.log('a user connected');
});


http.listen(3000)