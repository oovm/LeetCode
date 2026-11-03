export class Solution {
    numberOfSubstrings(s: string): number {
        const n = s.length;
        const zeroPos: number[] = [];
        for (let i = 0; i < n; i++) {
            if (s[i] === '0') zeroPos.push(i);
        }
        zeroPos.push(n);
        let total = 0;
        for (let start = 0; start < n; start++) {
            const zi = zeroPos.findIndex((p) => p >= start);
            for (let zeros = 0; zeros * zeros <= n; zeros++) {
                const nextIdx = zi + zeros;
                if (nextIdx >= zeroPos.length) break;
                const hi = zeroPos[nextIdx] - 1;
                const lo = zeros === 0 ? start : zeroPos[nextIdx - 1];
                const minEnd = start + zeros * zeros + zeros - 1;
                const from = Math.max(lo, minEnd);
                if (from <= hi) {
                    total += hi - from + 1;
                }
                if (zeroPos[nextIdx] === n) break;
            }
        }
        return total;
    }
}
