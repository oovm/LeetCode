export class Solution {
    maxLengthBetweenEqualCharacters(s: string): number {
        const first = new Array<number>(26).fill(-1);
        let best = -1;
        for (let i = 0; i < s.length; i++) {
            const idx = s.charCodeAt(i) - 97;
            if (first[idx] === -1) {
                first[idx] = i;
            } else {
                best = Math.max(best, i - first[idx] - 1);
            }
        }
        return best;
    }
}
