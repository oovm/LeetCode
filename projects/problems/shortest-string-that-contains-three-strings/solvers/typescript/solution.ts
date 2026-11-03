export class Solution {
    minimumString(a: string, b: string, c: string): string {
        const merge = (x: string, y: string): string => {
            for (let overlap = Math.min(x.length, y.length); overlap >= 0; overlap--) {
                if (x.endsWith(y.slice(0, overlap))) {
                    return x + y.slice(overlap);
                }
            }
            return x + y;
        };
        let best = '';
        for (const [x, y, z] of [
            [a, b, c],
            [a, c, b],
            [b, a, c],
            [b, c, a],
            [c, a, b],
            [c, b, a],
        ]) {
            const merged = merge(merge(x, y), z);
            if (best === '' || merged.length < best.length || (merged.length === best.length && merged < best)) {
                best = merged;
            }
        }
        return best;
    }
}
