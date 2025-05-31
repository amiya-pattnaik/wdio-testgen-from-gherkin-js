const { browser, $ } = require('@wdio/globals');

class Page {
  open(path) {
    return browser.url(`https://the-internet.herokuapp.com/${path}`);
  }

  async trySelector(primary, fallbacks) {
    try {
      const el = await $(primary);
      if (await el.isExisting() && await el.isDisplayed()) {
        console.log(`✅ Using primary selector: ${primary}`);
        return el;
      }
    } catch (e) {
      console.warn(`⚠️ Failed to find element with primary selector: ${primary}`);
    }
    for (const sel of fallbacks) {
      try {
        const fallback = await $(sel);
        if (await fallback.isExisting() && await fallback.isDisplayed()) {
          console.log(`↪️ Using fallback selector: ${sel}`);
          return fallback;
        }
      } catch {}
    }
    throw new Error(`❌ All selectors failed:\nPrimary: ${primary}\nFallbacks: ${fallbacks.join(', ')}`);
  }
}

module.exports = Page;