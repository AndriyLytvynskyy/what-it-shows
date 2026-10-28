// The desk's view of a ticket (groupByCause, as CauseTable counts it), plus the reports the desk read
// differently (desk-notes.json) as a cause of their own: counted where they're filed, and again here,
// because the fix for the cause they're filed under does not fix them.
import { groupByCause, readAs, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type SplitGroup = Omit<CauseGroup, 'cause'> & { cause: CauseGroup['cause'] | 'shift'; filedUnder?: CauseGroup['cause'] };

export function splitByCause(reports: Report[], tenantOf: (r: Report) => Tenant | undefined, shiftIds: readonly string[]): SplitGroup[] {
  const groups: SplitGroup[] = groupByCause(reports, tenantOf);
  const shift = reports.filter((r) => shiftIds.includes(r.id));
  if (shift.length) {
    const [g] = groupByCause(shift, () => undefined);
    const filedUnder = groups.find((x) => readAs(x as CauseGroup, shiftIds) > 0)?.cause as CauseGroup['cause'] | undefined;
    groups.push({ ...g, cause: 'shift', filedUnder });
  }
  return groups;
}
