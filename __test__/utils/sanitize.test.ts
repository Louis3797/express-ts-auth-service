/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type { SanitizeOptions } from '../../src/types/types';
import { sanitize } from '../../src/utils/sanitize.util';

describe('sanitize', () => {
  it('should return empty data as is', () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize(undefined)).toBeUndefined();
    expect(sanitize('')).toBe('');
    expect(sanitize({})).toEqual({});
    expect(sanitize([])).toEqual([]);
  });

  it('should sanitize strings', () => {
    const input = '<script>alert("hello world!")</script>';
    const expected = '&lt;script&gt;alert("hello world!")&lt;/script&gt;';
    expect(sanitize(input)).toBe(expected);
  });

  it('should sanitize objects', () => {
    const input = {
      name: '<script>alert("hello world!");</script>',
      age: 20,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '<script>alert("hello world!");</script>'
      },
      friends: [
        { name: '<script>alert("hello world!");</script>', age: 22 },
        { name: 'Alice', age: '<script>alert("hello world!");</script>' }
      ]
    };

    const expected = {
      name: '&lt;script&gt;alert("hello world!");&lt;/script&gt;',
      age: 20,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '&lt;script&gt;alert("hello world!");&lt;/script&gt;'
      },
      friends: [
        {
          name: '&lt;script&gt;alert("hello world!");&lt;/script&gt;',
          age: 22
        },
        {
          name: 'Alice',
          age: '&lt;script&gt;alert("hello world!");&lt;/script&gt;'
        }
      ]
    };

    expect(sanitize(input)).toEqual(expected);
  });

  it('should sanitize arrays', () => {
    const input = [
      '<script>alert("hello world!")</script>',
      20,
      ['<div>test</div>']
    ];
    const expected = [
      '&lt;script&gt;alert("hello world!")&lt;/script&gt;',
      20,
      ['&lt;div&gt;test&lt;/div&gt;']
    ];
    expect(sanitize(input)).toEqual(expected);
  });

  it('should sanitize an array of objects', () => {
    const input = [
      { name: '<script>alert("hello world!");</script>', age: 20 },
      { name: 'Alice', age: '<script>alert("hello world!");</script>' }
    ];

    const expected = [
      {
        name: '&lt;script&gt;alert("hello world!");&lt;/script&gt;',
        age: 20
      },
      {
        name: 'Alice',
        age: '&lt;script&gt;alert("hello world!");&lt;/script&gt;'
      }
    ];
    expect(sanitize(input)).toEqual(expected);
  });

  it('should allow custom XSS whiteList', () => {
    const input = '<div><a href="http://example.com">Example</a></div>';
    const expected = '<div><a href="http://example.com">Example</a></div>';
    const options: SanitizeOptions = {
      whiteList: {
        div: ['*'],
        a: ['href', 'target']
      }
    };
    expect(sanitize(input, options)).toBe(expected);
  });
});
