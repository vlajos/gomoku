var serverPort = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var serverIpAddress = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var express = require('express');
var app = express();
app.use(express.static('app'));
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var GomokuServer = require('./server/gomoku_server.js');
io.on('connection', GomokuServer.onClientConnect);
server.listen(serverPort, serverIpAddress, function(){
  console.log('Listening on ' + serverIpAddress + ', serverPort ' + serverPort)
});
