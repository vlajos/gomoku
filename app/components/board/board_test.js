'use strict';

describe('Gomoku.board module', function() {
  beforeEach(module('Gomoku.board'));

  describe('board service', function() {
    it('should return current board', inject(function(board) {
      expect(board).toEqual('0.1');
    }));
  });
});
