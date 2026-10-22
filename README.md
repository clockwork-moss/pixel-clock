# Pixel Clock

A quiet retro desk clock with three phosphor themes. Switch between local time,
a pauseable stopwatch and a countdown that stays accurate when rendering slows.
No server, account or external font is needed.

## Run locally

Use Node.js 22.12+ and npm. From this directory:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Choose Clock, Stopwatch or Timer at the
top. Set a countdown from 0.01 to 1440 minutes, then press Start. Completion is
shown as a status announcement. Timers continue when switching modes; reloading
resets active counters. Themes, hour format and configured duration persist in
local storage when browser permissions allow it.

## Keyboard

- `1`, `2`, `3`: clock, stopwatch, countdown.
- `Space`: start/pause the active counter.
- `R`: reset the active counter.

Shortcuts yield to focused form controls and buttons. All actions also have
labeled controls. Stopwatch time uses a monotonic browser clock; this is not
an alarm service and operating-system sleep behavior depends on the browser.

## Check and build

```sh
npm test
npm run build
npm run preview
```

Tests exercise counters, persistence, countdown validation and keyboard controls.
The production site is in `dist/`; deploy that directory to any static host.
MIT licensed.
