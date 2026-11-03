export class Solution {
    orderlyQueue(s: string, k: number): string {
        if (k > 1) {
            return [...s].sort().join('');
        }
        let best = s;
        for (let i = 1; i < s.length; i++) {
            const rotated = s.slice(i) + s.slice(0, i);
            if (rotated < best) best = rotated;
        }
        return best;
    }
}
