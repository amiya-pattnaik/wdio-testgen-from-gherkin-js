const { expect } = require('@wdio/globals');
const login = require('../pageobjects/login.page');

describe('login', () => {
  it('This is my successful login', async () => {
    await login.open();
    await login.thisIsMySuccessfulLogin();
  });

});