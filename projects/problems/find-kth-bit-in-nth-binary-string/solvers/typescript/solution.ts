export class Solution {
    findKthBit(n: number, k: number): number {
        const bit = (level: number, pos: number): number => {
            if (level === 1) {
                return 0;
            }
            const len = 2 ** level - 1;
            const mid = Math.floor(len / 2) + 1;
            if (pos === mid) {
                return 1;
            }
            if (pos < mid) {
                return bit(level - 1, pos);
            }
            return 1 - bit(level - 1, len - pos + 1);
        };
        return bit(n, k);
    }
}
