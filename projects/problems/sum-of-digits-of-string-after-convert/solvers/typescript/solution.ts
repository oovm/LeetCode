export class Solution {
    getLucky(s: string, k: number): number {
        let current = 0;
        for (const ch of s) {
            const v = ch.charCodeAt(0) - 96;
            current += (v % 10) + Math.floor(v / 10);
        }
        for (let round = 1; round < k; round++) {
            let next = 0;
            while (current > 0) {
                next += current % 10;
                current = Math.floor(current / 10);
            }
            current = next;
        }
        return current;
    }
}
