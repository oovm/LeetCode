export class Solution {
    rearrangeCharacters(s: string, target: string): number {
        const count = (text: string): Map<string, number> => {
            const m = new Map<string, number>();
            for (const ch of text) {
                m.set(ch, (m.get(ch) ?? 0) + 1);
            }
            return m;
        };
        const have = count(s);
        const need = count(target);
        let best = Infinity;
        for (const [ch, c] of need) {
            best = Math.min(best, Math.floor((have.get(ch) ?? 0) / c));
        }
        return best;
    }
}
