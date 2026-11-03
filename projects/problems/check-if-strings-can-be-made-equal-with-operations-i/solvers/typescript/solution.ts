export class Solution {
    canBeEqual(s1: string, s2: string): boolean {
        for (const parity of [0, 1]) {
            const a = [s1[parity], s1[parity + 2]].sort().join('');
            const b = [s2[parity], s2[parity + 2]].sort().join('');
            if (a !== b) {
                return false;
            }
        }
        return true;
    }
}
