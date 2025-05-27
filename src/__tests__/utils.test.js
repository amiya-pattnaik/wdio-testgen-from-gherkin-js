// src/__tests__/utils.test.ts
// this code is only for unit testing to makesure that all code inside src works.

const { generateShortName, buildActionLine } = require('../utils');


describe('generateShortName()', () => {
  it('should convert quoted string to camelCase', () => {
    const input = 'I enter "John Doe" into the field';
    const result = generateShortName(input);
    expect(result).toBe('johnDoe');
  });

  it('should use nouns when no quotes', () => {
    const input = 'click the login button';
    const result = generateShortName(input);
    expect(result).toBe('loginButton');
  });

  it('should fallback to text if nothing is parsed', () => {
    const input = '';
    const result = generateShortName(input);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

describe('buildActionLine()', () => {
  it('should generate a click action', () => {
    const result = buildActionLine('this.loginButton', 'click', '');
    expect(result).toBe('await (await this.loginButton).click();');
  });

  it('should handle setValue with note', () => {
    const result = buildActionLine('this.usernameField', 'setValue', 'admin');
    expect(result).toBe("await (await this.usernameField).setValue('admin');");
  });

  it('should return null for unknown actions', () => {
    const result = buildActionLine('this.element', 'doNothing', '');
    expect(result).toBeNull();
  });
});
