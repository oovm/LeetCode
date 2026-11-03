export class Solution {
    findRotateSteps(key: string, ring: string): number {
        const n = ring.length;
        const positions = new Map<string, number[]>();
        for (let i = 0; i < n; i++) {
            const list = positions.get(ring[i]) ?? [];
            list.push(i);
            positions.set(ring[i], list);
        }
        let dp = new Map<number, number>([[0, 0]]);
        for (const ch of key) {
            const next = new Map<number, number>();
            for (const target of positions.get(ch) ?? []) {
                let best = Infinity;
                for (const [pos, steps] of dp) {
                    const diff = Math.abs(pos - target);
                    best = Math.min(best, steps + Math.min(diff, n - diff));
                }
                next.set(target, best);
            }
            dp = next;
        }
        return Math.min(...dp.values()) + key.length;
    }
}
