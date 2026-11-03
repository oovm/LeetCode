export class Solution {
    addMinimum(word: string): number {
        let groups = 1;
        for (let i = 1; i < word.length; i++) {
            if (word[i] <= word[i - 1]) {
                groups += 1;
            }
        }
        return groups * 3 - word.length;
    }
}
