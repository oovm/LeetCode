export class Solution {
    findLexSmallestString(s: string, a: number, b: number): string {
        const seen = new Set<string>([s]);
        const queue = [s];
        let best = s;
        while (queue.length > 0) {
            const cur = queue.shift()!;
            if (cur < best) {
                best = cur;
            }
            const added = [...cur]
                .map((ch, i) => (i % 2 === 1 ? String((Number(ch) + a) % 10) : ch))
                .join('');
            const rotated = cur.slice(cur.length - b) + cur.slice(0, cur.length - b);
            for (const next of [added, rotated]) {
                if (!seen.has(next)) {
                    seen.add(next);
                    queue.push(next);
                }
            }
        }
        return best;
    }
}
