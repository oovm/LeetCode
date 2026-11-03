export class Solution {
    secondHighest(s: string): number {
        let first = -1;
        let second = -1;
        for (const ch of s) {
            if (ch >= '0' && ch <= '9') {
                const d = ch.charCodeAt(0) - 48;
                if (d > first) {
                    [first, second] = [d, first];
                } else if (d < first && d > second) {
                    second = d;
                }
            }
        }
        return second;
    }
}
