export class Solution {
    minDeletions(s: string): number {
        const counts = new Array<number>(26).fill(0);
        for (const ch of s) {
            counts[ch.charCodeAt(0) - 97] += 1;
        }
        counts.sort((a, b) => b - a);
        const used = new Set<number>();
        let deletions = 0;
        for (const c of counts) {
            let f = c;
            while (f > 0 && used.has(f)) {
                f -= 1;
                deletions += 1;
            }
            used.add(f);
        }
        return deletions;
    }
}
