'use strict';

angular.module('Gomoku.board.board-controller', [])

.controller('BoardCtrl', ['$scope', 'SocketIO', function($scope, SocketIO) {
  SocketIO.on('NextStepIs', function(step){
    $scope.game.board[step.row][step.col]=step.player;
  });
  $scope.clickOnBoard = function(row,col){
    SocketIO.emit('MyStepIs', {row:row, col:col});
  }
}]);
