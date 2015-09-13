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
  var options = {};
  if(document.location.hostname.indexOf('rhcloud.com') !== -1){
    options.ioSocket = io.connect('http://' + document.location.hostname + ':8000/');
  }
  return socketFactory(options);
})
.config(function ($analyticsProvider) {
  $analyticsProvider.firstPageview(true); /* Records pages that don't use $state or $route */
  $analyticsProvider.withAutoBase(true);  /* Records full path */
});
