export class Solution {
    largestValsFromLabels(values: number[], labels: number[], numWanted: number, useLimit: number): number {
        const ordered = values.map((value, index) => ({ value, label: labels[index] })).sort((a, b) => b.value - a.value);
        const used = new Map<number, number>();
        let total = 0;
        let picked = 0;
        for (const entry of ordered) {
            const taken = used.get(entry.label) ?? 0;
            if (taken >= useLimit) {
                continue;
            }
            used.set(entry.label, taken + 1);
            total += entry.value;
            picked++;
            if (picked === numWanted) {
                return total;
            }
        }
        return total;
    }
}
