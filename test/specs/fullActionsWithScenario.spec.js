const { expect } = require('@wdio/globals');
const fullActionsWithScenario = require('../pageobjects/fullActionsWithScenario.page');

describe('fullActionsWithScenario', () => {
  it('Perform all basic browser actions', async () => {
    await fullActionsWithScenario.open();
    await fullActionsWithScenario.performAllBasicBrowserActions();
  });

  it('Form validation with input clearing', async () => {
    await fullActionsWithScenario.open();
    await fullActionsWithScenario.formValidationWithInputClearing();
  });

  it('Element visibility and enabled checks', async () => {
    await fullActionsWithScenario.open();
    await fullActionsWithScenario.elementVisibilityAndEnabledChecks();
  });

  it('Page title and URL assertions', async () => {
    await fullActionsWithScenario.open();
    await fullActionsWithScenario.pageTitleAndURLAssertions();
  });

  it('Custom wait and scrolling', async () => {
    await fullActionsWithScenario.open();
    await fullActionsWithScenario.customWaitAndScrolling();
  });

});