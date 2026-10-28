<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { splitByCause } from '#lib/kb/split';

  // tickets: cause → the ticket filed for it.
  let { ticket, tickets }: { ticket: number; tickets: Record<string, string> } = $props();

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
    <tr><th>cause</th><th>reports</th><th>intake tagged otherwise</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr>
        <td><code>{g.cause}</code></td>
        <td>{g.reports.length}</td>
        <td>{mistagged(g)}</td>
        <td>{g.tenants}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
        <td>{#if tickets[g.cause]}<a href={tickets[g.cause]}>{tickets[g.cause].split('/').slice(-3).join(' ').replace(' issues ', ' #')}</a>{:else}none{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  .sum { font-size: 1.1rem; }
</style>
