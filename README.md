# what-it-shows
MEGA.dev S01E03: tickets split from #4471

## S01E03 · what it shows

Ticket #4471 merged 412 reports as one issue. They are three problems:

| ticket | cause | reports |
|---|---|---|
| [#1](https://github.com/AndriyLytvynskyy/what-it-shows/issues/1) | shared parser reads day-first dates month first | 374 |
| [#2](https://github.com/AndriyLytvynskyy/what-it-shows/issues/2) | booking-v3 form hint says MM/DD/YYYY, form reads day first | 33 |
| [#3](https://github.com/AndriyLytvynskyy/what-it-shows/issues/3) | bookings shift by one day (timezone / day boundary) | 5 |

- The kb page (source): [`kb/src/routes/kb/incidents/4471/causes/+page.svx`](kb/src/routes/kb/incidents/4471/causes/+page.svx), with its logic in `kb/src/lib/kb/split.ts` and `kb/src/lib/kb/SplitTable.svelte`.
- The page as the desk sees it (built with SvelteKit + mdsvex): [`rendered/kb/incidents/4471/causes.html`](rendered/kb/incidents/4471/causes.html). Desk ref `DR-8KJE-Z710`.
- Rebuild: `cd kb && npm ci && npm run build`.
