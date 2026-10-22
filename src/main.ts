import './style.css';
import { Counter, duration, readSettings, writeSettings, defaults, type Mode, type Theme } from './core';
const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
let settings = { ...defaults };
try { settings = readSettings(localStorage); } catch { /* Storage may be unavailable. */ }
let mode: Mode = 'clock';
const stopwatch = new Counter();
const timer = new Counter(true, settings.minutes * 60000);
const theme = el<HTMLSelectElement>('theme');
const hour12 = el<HTMLInputElement>('hour12');
const minutes = el<HTMLInputElement>('minutes');
theme.value = settings.theme; hour12.checked = settings.hour12; minutes.value = String(settings.minutes);
function save() { try { writeSettings(localStorage, settings); } catch { /* Keep working without persistence. */ } }
function applyTheme() { document.documentElement.dataset.theme = settings.theme; }
applyTheme();
theme.addEventListener('change', () => { settings.theme = theme.value as Theme; applyTheme(); save(); });
hour12.addEventListener('change', () => { settings.hour12 = hour12.checked; save(); render(); });
function select(next: Mode) { mode = next; el('announcement').textContent = ''; render(); }
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-mode]')) button.addEventListener('click', () => select(button.dataset.mode as Mode));
function active() { return mode === 'timer' ? timer : stopwatch; }
function toggle() { if (mode !== 'clock') { active().toggle(performance.now()); el('announcement').textContent = ''; render(); } }
function reset() { if (mode !== 'clock') { active().reset(); el('announcement').textContent = ''; render(); } }
el('toggle').addEventListener('click', toggle); el('reset').addEventListener('click', reset);
el('set').addEventListener('click', () => {
  const value = Number(minutes.value);
  if (!Number.isFinite(value) || value < .01 || value > 1440) { el('announcement').textContent = 'Choose 0.01–1440 minutes.'; return; }
  settings.minutes = value; timer.target = value * 60000; timer.reset(); save(); el('announcement').textContent = 'Countdown set.'; render();
});
document.addEventListener('keydown', e => {
  if (e.target instanceof Element && e.target.closest('input,select,button,textarea')) return;
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  if (['1','2','3'].includes(e.key)) select((['clock','stopwatch','timer'] as Mode[])[Number(e.key)-1]);
  if (e.code === 'Space') { e.preventDefault(); toggle(); }
  if (e.key.toLowerCase() === 'r') reset();
});
function render() {
  const now = performance.now();
  if (timer.tick(now)) el('announcement').textContent = 'Countdown complete.';
  const date = new Date();
  el('display').textContent = mode === 'clock' ? date.toLocaleTimeString('en-GB', { hour12: settings.hour12 }) : duration(mode === 'timer' ? Math.ceil(timer.value(now)/1000)*1000 : stopwatch.value(now));
  el('status').textContent = mode === 'clock' ? 'LIVE / LOCAL' : active().running ? 'RUNNING' : mode === 'timer' && timer.value(now) === 0 ? 'COMPLETE' : 'PAUSED / READY';
  el('detail').textContent = mode === 'clock' ? date.toLocaleDateString(undefined, { weekday:'long',month:'long',day:'numeric',year:'numeric' }) : mode === 'timer' ? 'MAKE A LITTLE TIME' : 'ONE SECOND AT A TIME';
  el('timer-config').hidden = mode !== 'timer';
  el<HTMLButtonElement>('toggle').disabled = mode === 'clock'; el<HTMLButtonElement>('reset').disabled = mode === 'clock';
  el('toggle').textContent = mode !== 'clock' && active().running ? 'PAUSE' : 'START';
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-mode]')) button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
}
render(); setInterval(render, 100);
