export class Solution {
    isSameTree(p: (number | null)[], q: (number | null)[]): boolean {
        const walk = (i: number): boolean => {
            const a = i < p.length ? p[i] : undefined;
            const b = i < q.length ? q[i] : undefined;
            if (a == null || b == null) return a == null && b == null;
            return a === b && walk(2 * i + 1) && walk(2 * i + 2);
        };
        return walk(0);
    }
}
