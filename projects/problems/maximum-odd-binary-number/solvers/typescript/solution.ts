export class Solution {
    maximumOddBinaryNumber(s: string): string {
        const ones = [...s].filter((c) => c === '1').length;
        return '1'.repeat(ones - 1) + '0'.repeat(s.length - ones) + '1';
    }
}
