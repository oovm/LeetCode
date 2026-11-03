export class Solution {
    numberOfAlternatingGroups(colors: number[]): number {
        const n = colors.length;
        let count = 0;
        for (let i = 0; i < n; i++) {
            const mid = colors[(i + 1) % n];
            if (colors[i] !== mid && mid !== colors[(i + 2) % n]) count++;
        }
        return count;
    }
}
