// Helper methods for generator

const nlp = require('compromise');

function generateShortName(text) {
  const quoted = text.match(/"(.*?)"/)?.[1];
  if (quoted) {
    return quoted
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, ' ')
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/\s/g, '')
      .replace(/^./, str => str.toLowerCase());
  }
  const doc = nlp(text).not('should|be|is|are|the|and|a|to|i|for|have|has|with|of|in|on');
  const terms = doc.nouns().out('array');
  const base = terms.slice(0, 3).join(' ') || text;
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, ' ')
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^./, str => str.toLowerCase());
}

function extractQuotedText(text) {
  const match = text.match(/"(.*?)"/);
  return match ? match[1] : '';
}

function buildActionLine(selector, action, note) {
  switch (action) {
    case 'click': return `await (await ${selector}).click();`;
    case 'setText':
    case 'setValue': return `await (await ${selector}).setValue('${note}');`;
    case 'clearText': return `await (await ${selector}).clearValue();`;
    case 'selectDropdown': return `await (await ${selector}).selectByVisibleText('${note}');`;
    case 'uploadFile': return `await (await ${selector}).setValue('${note}');`;
    case 'hover': return `await (await ${selector}).moveTo();`;
    case 'scrollTo': return `await (await ${selector}).scrollIntoView();`;
    case 'waitForVisible': return `await (await ${selector}).waitForDisplayed();`;
    case 'assertVisible': return `await expect(await ${selector}).toBeDisplayed();`;
    case 'assertText': return `await expect(await ${selector}).toHaveTextContaining('${note}');`;
    case 'assertEnabled': return `await expect(await ${selector}).toBeEnabled();`;
    case 'assertDisabled': return `await expect(await ${selector}).toBeDisabled();`;
    case 'assertTitle': return `await expect(browser).toHaveTitle('${note}');`;
    case 'assertUrlContains': return `await expect(browser).toHaveUrl(expect.stringContaining('${note}'));`;
    default: return null;
  }
}

module.exports = {
  generateShortName,
  extractQuotedText,
  buildActionLine
};
