'use strict';

angular.module('Gomoku.chat.chat-controller', ['ngAnimate'])

.controller('ChatCtrl', ['$scope', 'SocketIO', function($scope, SocketIO) {
  SocketIO.on('ChatMessage', function(msg){
    $scope.addToChat(msg.message, ('from' in msg) ? msg.from : 'Server');
  });
  $scope.mainAction = function(){
    SocketIO.emit('MyNameIs', $scope.game.playerName);
    if(
      ($scope.game.state == 'Init') ||
      ($scope.game.state == 'End')
    ){
      $scope.resetBoard();
      $scope.game.state = 'Game';
      $scope.game.mainButton = 'Change!';
      $scope.game.highlight= [];
      SocketIO.emit('ConnectToOtherPlayer');
    }
  }
  $scope.resetBoard = function(){
    for(var i =0;i<$scope.game.height;i++){
      $scope.game.board[i] = [];
      for(var j =0;j<$scope.game.width;j++){
        $scope.game.board[i][j] = null;
      }
    }
  }
  $scope.sendMessage = function(){
    SocketIO.emit('ChatMessage', $scope.chatMessage);
    $scope.chatMessage = '';
  }
}]);
