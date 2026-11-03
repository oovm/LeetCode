export class Solution {
    minFlips(s: string): number {
        const n = s.length;
        const doubled = s + s;
        let diff = [0, 0];
        for (let i = 0; i < n; i++) {
            const want = i % 2 === 0 ? '0' : '1';
            if (doubled[i] !== want) diff[0] += 1;
            else diff[1] += 1;
        }
        let best = Math.min(diff[0], diff[1]);
        for (let i = n; i < 2 * n; i++) {
            const inWant = i % 2 === 0 ? '0' : '1';
            const outIdx = i - n;
            const outWant = outIdx % 2 === 0 ? '0' : '1';
            if (doubled[i] !== inWant) diff[0] += 1;
            else diff[1] += 1;
            if (doubled[outIdx] !== outWant) diff[0] -= 1;
            else diff[1] -= 1;
            best = Math.min(best, diff[0], diff[1]);
        }
        return best;
    }
}
