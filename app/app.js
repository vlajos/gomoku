'use strict';

// Declare app level module which depends on views, and components
angular.module('Gomoku', [
  'Gomoku.main',
  'Gomoku.board',
  'Gomoku.chat',
  'btford.socket-io',
  'ngAnimate'
]).
factory('SocketIO', function (socketFactory) {
  return socketFactory();
});
