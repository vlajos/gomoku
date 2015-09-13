'use strict';

// Declare app level module which depends on views, and components
angular.module('Gomoku', [
  'Gomoku.main',
  'Gomoku.board',
  'Gomoku.chat',
  'btford.socket-io',
  'ngAnimate',
  'angulartics',
  'angulartics.google.analytics'
]).
factory('SocketIO', function (socketFactory) {
  return socketFactory();
})
.config(function ($analyticsProvider) {
  $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
  $analyticsProvider.withAutoBase(true);  /* Records full path */
});
