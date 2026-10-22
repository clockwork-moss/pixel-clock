// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
beforeEach(async()=>{
  vi.useFakeTimers(); vi.resetModules(); localStorage.clear();
  document.documentElement.innerHTML=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  await import('../src/main');
});
afterEach(()=>{vi.clearAllTimers();vi.useRealTimers();});
it('switches modes and validates countdown input',()=>{
  (document.querySelector('[data-mode="timer"]') as HTMLElement).click();
  expect(document.getElementById('timer-config')!.hidden).toBe(false);
  (document.getElementById('minutes') as HTMLInputElement).value='0'; document.getElementById('set')!.click();
  expect(document.getElementById('announcement')!.textContent).toContain('Choose');
  (document.getElementById('minutes') as HTMLInputElement).value='2'; document.getElementById('set')!.click();
  expect(document.getElementById('display')!.textContent).toBe('00:02:00');
});
it('supports keyboard controls and theme persistence',()=>{
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'2'}));
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'Space',key:' '}));
  expect(document.getElementById('toggle')!.textContent).toBe('PAUSE');
  document.dispatchEvent(new KeyboardEvent('keydown',{key:'r'}));
  expect(document.getElementById('toggle')!.textContent).toBe('START');
  const theme=document.getElementById('theme') as HTMLSelectElement;theme.value='amber';theme.dispatchEvent(new Event('change'));
  expect(JSON.parse(localStorage.getItem('pixel-clock')!).theme).toBe('amber');
});
