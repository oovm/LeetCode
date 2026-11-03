export class Solution {
    minimumPartition(s: string, k: number): number {
        let parts = 1;
        let value = 0;
        for (const ch of s) {
            const d = ch.charCodeAt(0) - 48;
            if (d > k) {
                return -1;
            }
            if (value * 10 + d > k) {
                parts += 1;
                value = d;
            } else {
                value = value * 10 + d;
            }
        }
        return parts;
    }
}
