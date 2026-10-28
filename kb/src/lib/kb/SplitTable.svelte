<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitByCause } from '#lib/kb/split';

  // tickets: cause → the ticket filed for it and what became of it.
  type Filed = { href: string; label: string; outcome: string };
  let { ticket, tickets }: { ticket: number; tickets: Record<string, Filed> } = $props();

  const rows = $derived((reports as Report[]).filter((r) => r.mergedInto === ticket));
  const merged = $derived(uniqueById(rows));
  const groups = $derived(splitByCause(merged, tenantOf, notes.oneDayMove));
  const mistagged = (g: { cause: string; taggedAs: Record<string, number> }) =>
    Object.entries(g.taggedAs).filter(([tag]) => tag !== g.cause).reduce((n, [, k]) => n + k, 0);
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ({rows.length} export rows) ·
  <strong>{groups.length}</strong> causes
</p>

<table>
  <thead>
    <tr><th>cause</th><th>reports</th><th>intake tagged otherwise</th><th>tenants</th><th>seen</th><th>ticket</th><th>outcome</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr class:open={tickets[g.cause]?.outcome === 'open'}>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}{#if g.filedUnder}<sup>*</sup>{/if}</td>
        <td>{mistagged(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if tickets[g.cause]}<a href={tickets[g.cause].href}>{tickets[g.cause].label}</a>{:else}none{/if}</td>
        <td>{tickets[g.cause]?.outcome ?? '—'}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups.filter((g) => g.filedUnder) as g (g.cause)}
  <p class="note">* {g.reports.length} reports read as a one-day move; filed under <code>{g.filedUnder}</code> by tenant and counted there too, as the desk counts them.</p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
</style>
