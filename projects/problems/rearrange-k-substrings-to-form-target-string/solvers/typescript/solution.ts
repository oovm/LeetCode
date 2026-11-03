export class Solution {
    isPossibleToRearrange(s: string, k: number, t: string): boolean {
        const size = s.length / k;
        const count = (text: string): Map<string, number> => {
            const m = new Map<string, number>();
            for (let i = 0; i < text.length; i += size) {
                const seg = text.slice(i, i + size);
                m.set(seg, (m.get(seg) ?? 0) + 1);
            }
            return m;
        };
        const a = count(s);
        const b = count(t);
        if (a.size !== b.size) return false;
        for (const [seg, c] of a) {
            if (b.get(seg) !== c) return false;
        }
        return true;
    }
}
