var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var players = {};
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', function (socket) {
    console.log('a user connected');
    players[socket.id] = {
        rotation: 0,
        x: 400,
        y: 400,
        playerId: socket.id
    };
    // send the players object to the new player
    socket.emit('currentPlayers', players);
    // update all other players of the new player
    socket.broadcast.emit('newPlayer', players[socket.id]);
    socket.on('disconnect', function () {
        console.log('user disconnected');
        delete players[socket.id];
        socket.emit('disconnected', socket.id);
    });
    socket.on('move', function (id,x,y,angle) {
        socket.broadcast.emit('moved', socket.id,x,y,angle);
    });
});
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});