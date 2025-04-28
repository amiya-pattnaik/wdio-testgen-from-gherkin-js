const { expect } = require('@wdio/globals');
const fullActions = require('../pageobjects/fullActions.page');

describe('fullActions', () => {
  it('User interacts with all UI elements', async () => {
    await fullActions.open();
    await fullActions.userInteractsWithAllUIElements();
  });

});