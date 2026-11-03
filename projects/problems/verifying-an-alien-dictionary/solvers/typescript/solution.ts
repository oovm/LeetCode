export class Solution {
    isAlienSorted(words: string[], order: string): boolean {
        const rank = new Map<string, number>();
        for (let i = 0; i < order.length; i++) rank.set(order[i], i);
        const before = (a: string, b: string): boolean => {
            const n = Math.min(a.length, b.length);
            for (let i = 0; i < n; i++) {
                const ra = rank.get(a[i])!;
                const rb = rank.get(b[i])!;
                if (ra !== rb) return ra < rb;
            }
            return a.length <= b.length;
        };
        for (let i = 1; i < words.length; i++) {
            if (!before(words[i - 1], words[i])) return false;
        }
        return true;
    }
}
