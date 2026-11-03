export class Solution {
    checkStrings(s1: string, s2: string): boolean {
        for (const parity of [0, 1]) {
            const counts = new Array<number>(26).fill(0);
            for (let i = parity; i < s1.length; i += 2) {
                counts[s1.charCodeAt(i) - 97] += 1;
                counts[s2.charCodeAt(i) - 97] -= 1;
            }
            if (counts.some((c) => c !== 0)) {
                return false;
            }
        }
        return true;
    }
}
