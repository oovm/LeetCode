export class Solution {
    countAsterisks(s: string): number {
        let count = 0;
        let inside = false;
        for (const ch of s) {
            if (ch === "|") inside = !inside;
            else if (ch === "*" && !inside) count++;
        }
        return count;
    }
}
