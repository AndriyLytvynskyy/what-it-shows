// Splits a ticket's reports by cause, with the desk's one-day moves (desk-notes.json) as their own
// cause: they are no swap, so neither `parser` nor `hint` fixes them.
import { groupByCause, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type SplitGroup = Omit<CauseGroup, 'cause'> & { cause: CauseGroup['cause'] | 'shift' };

export function splitByCause(reports: Report[], tenantOf: (r: Report) => Tenant | undefined, shiftIds: readonly string[]): SplitGroup[] {
  const shift = reports.filter((r) => shiftIds.includes(r.id));
  const rest = reports.filter((r) => !shiftIds.includes(r.id));
  const groups: SplitGroup[] = groupByCause(rest, tenantOf);
  if (shift.length) {
    const [g] = groupByCause(shift, () => undefined);
    groups.push({ ...g, cause: 'shift' });
  }
  return groups.sort((a, b) => b.reports.length - a.reports.length);
}
