export class Solution {
    getLongestSubsequence(words: string[], groups: number[]): string[] {
        const result: string[] = [words[0]];
        for (let i = 1; i < words.length; i++) {
            if (groups[i] !== groups[i - 1]) result.push(words[i]);
        }
        return result;
    }
}
