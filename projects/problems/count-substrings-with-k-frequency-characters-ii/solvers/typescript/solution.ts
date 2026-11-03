export class Solution {
    numberOfSubstrings(s: string, k: number): number {
        let total = 0;
        let left = 0;
        const counts = new Array<number>(26).fill(0);
        let hits = 0;
        for (let right = 0; right < s.length; right++) {
            const c = s.charCodeAt(right) - 97;
            counts[c] += 1;
            if (counts[c] === k) hits += 1;
            while (hits > 0) {
                total += s.length - right;
                const lc = s.charCodeAt(left) - 97;
                if (counts[lc] === k) hits -= 1;
                counts[lc] -= 1;
                left += 1;
            }
        }
        return total;
    }
}
