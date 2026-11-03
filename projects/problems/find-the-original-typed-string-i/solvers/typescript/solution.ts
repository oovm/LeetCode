export class Solution {
    possibleStringCount(word: string): number {
        let total = 1;
        let run = 1;
        for (let i = 1; i <= word.length; i++) {
            if (i < word.length && word[i] === word[i - 1]) {
                run += 1;
            } else {
                total += run - 1;
                run = 1;
            }
        }
        return total;
    }
}
