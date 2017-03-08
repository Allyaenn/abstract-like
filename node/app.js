var http = require('http');
var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
// Chargement de socket.io
var io = require('socket.io')(server);

app.use(express.static(__dirname + "/../" + 'public'));

server.listen(8080);

// Quand un client se connecte, on le note dans la console
// io.sockets.on('connection', function (socket) {
//     console.log('Un client est connecté !');
// });

// io.sockets.on('connection', function (socket) {
//         socket.emit('message', 'Vous êtes bien connecté !');
// });

io.sockets.on('connection', function (socket) {
  socket.on('interaction', function(data) {
        console.log("interaction received");
        io.sockets.emit('interaction', data);
  });

  socket.on('memory', function(data) {
        console.log("memory received");
        io.sockets.emit('memory', data);
  });

  socket.on('log', function(data) {
        console.log("log received");
        io.sockets.emit('log', data);
  });

});
