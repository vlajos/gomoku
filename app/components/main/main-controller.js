'use strict';

angular.module('Gomoku.main.main-controller', [])

.controller('MainCtrl', ['$scope', 'SocketIO', '$anchorScroll', '$location', '$sce', function($scope, SocketIO, $anchorScroll, $location, $sce) {
  $scope.game = {
    playerName: 'Guest',
    state: 'Init',
    mainButton: 'Start!',
    highlight: {},
    board: [],
    height: 12,
    width: 12
  }
  $scope.chat = [];

  $scope.addToChat = function(message, from){
    $scope.chat.push({
      from: from,
      message: $sce.trustAsHtml(message),
      time: (new Date).toLocaleTimeString()
    });
    $location.hash('chat-' + ($scope.chat.length-1));
    $anchorScroll();
  }
  SocketIO.on('EndGame', function(data){
    $scope.addToChat(data.message, 'Server');
    $scope.game.state = 'End';
    $scope.game.mainButton = 'New game!';
    data.highlight.forEach(function(cell){
      $scope.game.highlight[cell.row + '-' + cell.col] = 1;
    });
  });
}]);
