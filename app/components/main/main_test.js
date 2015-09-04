'use strict';

describe('Gomoku.main module', function() {
  beforeEach(module('Gomoku.main'));

  describe('main service', function() {
    it('should return current main', inject(function(main) {
      expect(main).toEqual('0.1');
    }));
  });
});
