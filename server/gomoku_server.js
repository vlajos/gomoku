var GomokuServer = {
  clients: {},
  games: {},
  clientWaitingForConnection: false,
  height: 12,
  width: 12
};
var util = require('util');

GomokuServer.attachListeners = function(socket, events){
  events.forEach(function(event){
    socket.on(event, GomokuServer['on' + event.charAt(0).toUpperCase() + event.slice(1)].bind(null,socket.id));
  });
}

GomokuServer.broadcastToGame = function(gameId, msg, arg){
  GomokuServer.games[gameId].clients.forEach(function(client){
    client.socket.emit(msg, arg);
  });
}

GomokuServer.broadcastToGameOrPlayer = function(clientId, msg, arg){
  if(GomokuServer.clients[clientId].game !== false){
    GomokuServer.broadcastToGame(GomokuServer.clients[clientId].game, msg, arg);
  } else {
    GomokuServer.clients[clientId].socket.emit(msg, arg);
  }
}

GomokuServer.onClientConnect = function(socket){
  console.log('Incoming connection from: ' + socket.conn.remoteAddress + ' id: ' + socket.id);
  socket.removeAllListeners();
  GomokuServer.clients[socket.id] = {
    name: 'Guest',
    id: socket.id,
    game: false,
    socket: socket
  }
  GomokuServer.attachListeners(socket, ['ConnectToOtherPlayer', 'MyNameIs', 'disconnect', 'ChatMessage', 'MyStepIs']);
  socket.emit('ChatMessage', {message: 'Welcome!'});
}

GomokuServer.onMyNameIs = function(id, name){
  if(name.length == 0){
    GomokuServer.clients[id].socket.emit('ChatMessage', {message: 'Too short name'});
    return 1;
  }
  if (GomokuServer.clients[id].name == name ){
    return 1;
  }
  GomokuServer.broadcastToGameOrPlayer(id, 'ChatMessage', {message: GomokuServer.clients[id].name + ' is now called ' + name});
  GomokuServer.clients[id].name = name;
}

GomokuServer.onChatMessage = function(id, msg){
  if(
    (msg == null) ||
    (msg.length == 0)
  ){
    return 1;
  }
  GomokuServer.broadcastToGameOrPlayer(id, 'ChatMessage', {message: msg, from: GomokuServer.clients[id].name});
}

GomokuServer.onConnectToOtherPlayer = function(id){
  if(GomokuServer.clientWaitingForConnection){
    GomokuServer.startNewGame([GomokuServer.clientWaitingForConnection, GomokuServer.clients[id]]);
    GomokuServer.clientWaitingForConnection = false;
  } else {
    GomokuServer.clientWaitingForConnection = GomokuServer.clients[id];
    GomokuServer.clients[id].socket.emit('ChatMessage', {message: 'Waiting for other players to connect'});
  }
}

GomokuServer.checkWinnerOneDirection = function (board, row, col, dir){
  var highlightCoordinates=[{'row':row, 'col':col}];
  [1,-1].forEach(function(multiplier){
    for(var i = 1; i < 5; i++ ){
      var nextRow = row + dir.row * multiplier * i;
      var nextCol = col + dir.col * multiplier * i;
      if(
        (board[nextRow]) &&
        (board[nextRow][nextCol] == board[row][col])
      ){
        highlightCoordinates.push({'row': nextRow, 'col': nextCol});
      } else {
        break;
      }
    }
  });
  return highlightCoordinates;
}

GomokuServer.checkWinner = function (board, row,col){
  [
    {'row': 1, 'col': 0},
    {'row': 1, 'col': 1},
    {'row': 0, 'col': 1},
    {'row':-1, 'col': 1},
  ].forEach(function(dir){
    var highlight= GomokuServer.checkWinnerOneDirection(board, row, col, dir);
    if(highlight.length >=5){
      GomokuServer.finishGame(board[row][col], highlight);
      return 1;
    }
  });
}

GomokuServer.finishGame = function (winner, highlight){
  var gameId = GomokuServer.clients[winner].game;
  GomokuServer.broadcastToGame(
    gameId,
    'EndGame',
    {
      message: GomokuServer.clients[winner].name + ' won the game!',
      highlight: highlight
    }
  );
  GomokuServer.destroyGame(gameId);
}

GomokuServer.destroyGame = function(gameId){
  GomokuServer.games[gameId].clients.forEach(function(client){
    client.game = false;
  });
  delete GomokuServer.games[gameId];
}

GomokuServer.onMyStepIs = function(id, step){
  var gameId = GomokuServer.clients[id].game;
  if( gameId === false){
    GomokuServer.clients[id].socket.emit('ChatMessage', {message: 'Not allowed!'});
    return 1;
  }
  var game = GomokuServer.games[gameId];
  if(game.currentPlayer != id){
    GomokuServer.clients[id].socket.emit('ChatMessage', {message: 'This is not your turn!'});
    return 1;
  }
  if(
    typeof game.board[step.row] == 'undefined' ||
    game.board[step.row][step.col] !== null
  ){
    GomokuServer.clients[id].socket.emit('ChatMessage', {message: 'Invalid step.'});
    return 1;
  }
  game.clients.forEach(function(client){
    client.socket.emit('NextStepIs',{
      player: client.id == id ? 0 : 1, //0: your, 1: others
      row: step.row,
      col: step.col
    });
    if(client.id != id){
      game.currentPlayer = client.id;
    }
  });
  game.board[step.row][step.col] = id;
  GomokuServer.checkWinner(game.board, step.row, step.col);
}

GomokuServer.onDisconnect = function(id){
  var gameId = GomokuServer.clients[id].game;
  if(gameId !== false){
    GomokuServer.broadcastToGame(
      gameId,
      'EndGame',
      {
        message: GomokuServer.clients[id].name + ' left the game!',
        highlight: []
      }
    );
    GomokuServer.destroyGame(gameId);
  }
  if(GomokuServer.clientWaitingForConnection.id == id){
    GomokuServer.clientWaitingForConnection = false;
  }
}

GomokuServer.onError = function(id){
    //@todo
}

GomokuServer.startNewGame = function(clients){
  var game = {
    clients: clients,
  };
  game.board = [];
  for(var i =0;i<GomokuServer.height;i++){
    game.board[i] = [];
    for(var j =0;j<GomokuServer.width;j++){
      game.board[i][j] = null;
    }
  }

  var gameId = clients[0].id;
  GomokuServer.games[gameId] = game;
  game.currentPlayer = clients[0].id;
  clients.forEach(function(client){
    client.game = gameId;
    client.socket.emit('ChatMessage',{message:
    clients[0].name + ' and ' + clients[1].name + ' started a new game.<br />'  +
    'You are the ' + ((client.id == game.currentPlayer) ? 'first' : 'second')+ ' player!'});
  });
}

module.exports = GomokuServer;
