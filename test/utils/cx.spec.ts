import { cx } from '@/utils/cx';
import { describe, expect, test, vi } from 'vitest';

const fn = vi.fn(cx);

describe('cx', () => {
  test('strings', () => {
    expect(fn('')).toBe('');
    expect(fn('foo')).toBe('foo');
    expect(fn(true && 'foo')).toBe('foo');
    expect(fn(false && 'foo')).toBe('');
  });

  test('strings (variadic)', () => {
    expect(fn('')).toBe('');
    expect(fn('foo', 'bar')).toBe('foo bar');
    expect(fn(true && 'foo', false && 'bar', 'baz')).toBe('foo baz');
    expect(fn(false && 'foo', 'bar', 'baz', '')).toBe('bar baz');
  });

  test('numbers', () => {
    expect(fn(1)).toBe('1');
    expect(fn(12)).toBe('12');
    expect(fn(0.1)).toBe('0.1');
    expect(fn(0)).toBe('');

    expect(fn(Number.POSITIVE_INFINITY)).toBe('Infinity');
    expect(fn(Number.NaN)).toBe('');
  });

  test('numbers (variadic)', () => {
    expect(fn(0, 1)).toBe('1');
    expect(fn(1, 2)).toBe('1 2');
  });

  test('objects', () => {
    expect(fn({})).toBe('');
    expect(fn({ foo: true })).toBe('foo');
    expect(fn({ foo: true, bar: false })).toBe('foo');
    expect(fn({ foo: 'hiya', bar: 1 })).toBe('foo bar');
    expect(fn({ foo: 1, bar: 0, baz: 1, 'your name is': {} })).toBe(
      'foo baz your name is',
    );
    expect(fn({ '-foo': 1, '--bar': 1 })).toBe('-foo --bar');
    expect(fn({ push: 1 })).toBe('push');
    expect(fn({ pop: true })).toBe('pop');
    expect(fn({ push: true })).toBe('push');
    expect(fn('hello', { world: 1, push: true })).toBe('hello world push');
  });

  test('objects (variadic)', () => {
    expect(fn({}, {})).toBe('');
    expect(fn({ foo: 1 }, { bar: 2 })).toBe('foo bar');
    expect(fn({ foo: 1 }, null, { baz: 1, bat: 0 })).toBe('foo baz');
    expect(
      fn(
        { foo: 1 },
        {},
        {},
        { bar: 'a' },
        { baz: null, bat: Number.POSITIVE_INFINITY },
      ),
    ).toBe('foo bar bat');
  });
});
