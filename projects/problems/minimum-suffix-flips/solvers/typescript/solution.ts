export class Solution {
    minFlips(target: string): number {
        let flips = 0;
        let current = '0';
        for (const ch of target) {
            if (ch !== current) {
                flips += 1;
                current = ch;
            }
        }
        return flips;
    }
}
