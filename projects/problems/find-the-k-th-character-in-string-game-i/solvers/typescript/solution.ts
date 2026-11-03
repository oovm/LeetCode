export class Solution {
    kthCharacter(k: number): string {
        let shifts = 0;
        let x = k - 1;
        while (x > 0) {
            shifts += x & 1;
            x >>= 1;
        }
        return String.fromCharCode(97 + (shifts % 26));
    }
}
