export class Solution {
    countSubstrings(s: string, c: string): number {
        const count = [...s].filter((ch) => ch === c).length;
        return (count * (count + 1)) / 2;
    }
}
