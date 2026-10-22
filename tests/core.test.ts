import { describe, it, expect } from 'vitest';
import { Counter, duration, readSettings, writeSettings } from '../src/core';
describe('time counters', () => {
  it('pauses and resumes without counting paused time', () => {
    const c=new Counter(); c.toggle(100); expect(c.value(600)).toBe(500); c.toggle(600);
    expect(c.value(2000)).toBe(500); c.toggle(2000); expect(c.value(2500)).toBe(1000); c.reset(); expect(c.value(9000)).toBe(0);
  });
  it('completes once after a delayed frame and can restart', () => {
    const c=new Counter(true,1000); c.toggle(0); expect(c.tick(5000)).toBe(true); expect(c.tick(6000)).toBe(false); expect(c.value(6000)).toBe(0); c.toggle(6000); expect(c.value(6500)).toBe(500);
  });
  it('formats hours without wrapping at 24', () => { expect(duration(90061000)).toBe('25:01:01'); expect(duration(-1)).toBe('00:00:00'); });
});
describe('settings', () => {
  it('loads valid preferences', () => { expect(readSettings({getItem:()=>'{"theme":"ice","hour12":true,"minutes":2}'})).toEqual({theme:'ice',hour12:true,minutes:2}); });
  it('rejects malformed and invalid fields', () => { expect(readSettings({getItem:()=>'{'}).theme).toBe('moss'); expect(readSettings({getItem:()=>'{"minutes":-1}'}).minutes).toBe(5); });
  it('survives blocked storage', () => { expect(()=>writeSettings({setItem:()=>{throw Error('denied');}}, {theme:'moss',hour12:false,minutes:5})).not.toThrow(); });
});
