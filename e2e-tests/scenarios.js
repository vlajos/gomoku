'use strict';

describe('Gomoku', function() {

  it('should start and play a short game with 2 players', function() {
    browser.get('/');
    var browser2 = browser.forkNewDriverInstance(true, true);
    var element2 = browser2.element;
    var $2 = browser2.$;
    var $$2 = browser2.$$;
    element(by.model('$root.player_name')).clear();
    element(by.model('$root.player_name')).sendKeys('Alpha');
    element(by.css('button#change-name')).click();
    element2(by.model('$root.player_name')).clear();
    element2(by.model('$root.player_name')).sendKeys('Beta');
    element2(by.css('button#change-name')).click();

    element(by.id('cell-5-5')).click();
    element2(by.id('cell-5-6')).click();
    element(by.id('cell-4-5')).click();
    element2(by.id('cell-6-6')).click();
    element(by.id('cell-3-5')).click();
    element2(by.id('cell-7-7')).click();
    element(by.id('cell-7-5')).click();
    element2(by.id('cell-8-8')).click();
    element(by.id('cell-6-5')).click();
    element2(by.id('cell-9-9')).click();

    browser.driver.sleep(5000);
  });

});
