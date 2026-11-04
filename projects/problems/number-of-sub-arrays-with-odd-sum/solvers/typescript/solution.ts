export class Solution {
    numOfSubarrays(arr: number[]): number {
        const modulo = 1_000_000_007;
        let evenPrefixes = 1;
        let oddPrefixes = 0;
        let parity = 0;
        let total = 0;
        for (const value of arr) {
            if (value % 2 !== 0) parity = 1 - parity;
            if (parity === 1) {
                total = (total + evenPrefixes) % modulo;
                oddPrefixes += 1;
            } else {
                 total = (total + oddPrefixes) % modulo;
                evenPrefixes += 1;
            }
        }
        return total % modulo;
    }
}
