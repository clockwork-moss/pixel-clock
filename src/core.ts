export type Mode = 'clock' | 'stopwatch' | 'timer';
export type Theme = 'moss' | 'amber' | 'ice';
export interface Settings { theme: Theme; hour12: boolean; minutes: number }
export const defaults: Settings = { theme: 'moss', hour12: false, minutes: 5 };
export function readSettings(storage: Pick<Storage, 'getItem'>): Settings {
  try {
    const x = JSON.parse(storage.getItem('pixel-clock') || '{}');
    return { theme: ['moss','amber','ice'].includes(x.theme) ? x.theme : 'moss', hour12: x.hour12 === true,
      minutes: typeof x.minutes === 'number' && Number.isFinite(x.minutes) && x.minutes >= .01 && x.minutes <= 1440 ? x.minutes : 5 };
  } catch { return { ...defaults }; }
}
export function writeSettings(storage: Pick<Storage, 'setItem'>, settings: Settings): void {
  try { storage.setItem('pixel-clock', JSON.stringify(settings)); } catch { /* Private mode can disable storage. */ }
}
export function duration(ms: number): string {
  const seconds = Math.floor(Math.max(0, ms) / 1000);
  return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(x => String(x).padStart(2,'0')).join(':');
}
export class Counter {
  running = false;
  private accumulated = 0;
  private started = 0;
  constructor(public countdown = false, public target = 300000) {}
  elapsed(now: number): number { return this.accumulated + (this.running ? now - this.started : 0); }
  value(now: number): number { return this.countdown ? Math.max(0, this.target - this.elapsed(now)) : this.elapsed(now); }
  toggle(now: number): void {
    if (this.running) { this.accumulated = this.elapsed(now); this.running = false; }
    else { if (this.countdown && this.value(now) === 0) this.accumulated = 0; this.started = now; this.running = true; }
  }
  reset(): void { this.accumulated = 0; this.running = false; }
  tick(now: number): boolean {
    if (this.countdown && this.running && this.value(now) === 0) { this.accumulated = this.target; this.running = false; return true; }
    return false;
  }
}
