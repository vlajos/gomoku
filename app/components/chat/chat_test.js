'use strict';

describe('Gomoku.chat module', function() {
  beforeEach(module('Gomoku.chat'));

  describe('chat service', function() {
    it('should return current chat', inject(function(chat) {
      expect(chat).toEqual('0.1');
    }));
  });
});
