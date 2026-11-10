export class Solution {
    hasAlternatingBits(n: number): boolean {
        let value = n;
        let prev = value & 1;
        value >>= 1;
        while (value > 0) {
            const bit = value & 1;
            if (bit === prev) return false;
            prev = bit;
            value >>= 1;
        }
        return true;
    }
}
