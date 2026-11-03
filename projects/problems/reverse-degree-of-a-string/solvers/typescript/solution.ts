export class Solution {
    reverseDegree(s: string): number {
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            total += (26 - (s.charCodeAt(i) - 97)) * (i + 1);
        }
        return total;
    }
}
