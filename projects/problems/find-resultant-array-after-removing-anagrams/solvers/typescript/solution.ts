export class Solution {
    removeAnagrams(words: string[]): string[] {
        const key = (w: string) => [...w].sort().join("");
        const result: string[] = [];
        for (const w of words) {
            if (result.length === 0 || key(result[result.length - 1]) !== key(w)) {
                result.push(w);
            }
        }
        return result;
    }
}
