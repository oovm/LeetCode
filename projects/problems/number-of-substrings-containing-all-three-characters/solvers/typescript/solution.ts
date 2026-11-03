export class Solution {
    numberOfSubstrings(s: string): number {
        const last = [-1, -1, -1];
        let total = 0;
        for (let i = 0; i < s.length; i++) {
            last[s.charCodeAt(i) - 97] = i;
            const earliest = Math.min(...last);
            if (earliest !== -1) {
                total += earliest + 1;
            }
        }
        return total;
    }
}
