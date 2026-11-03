export class Solution {
    findTarget(root: (number | null)[], k: number): boolean {
        const seen = new Set<number>();
        for (const v of root) {
            if (v === null) continue;
            if (seen.has(k - v)) return true;
            seen.add(v);
        }
        return false;
    }
}
