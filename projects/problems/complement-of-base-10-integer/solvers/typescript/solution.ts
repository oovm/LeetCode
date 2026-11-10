export class Solution {
    bitwiseComplement(n: number): number {
        if (n === 0) return 1;
        let mask = 1;
        while (mask < n) mask = mask * 2 + 1;
        return mask - n;
    }
}
