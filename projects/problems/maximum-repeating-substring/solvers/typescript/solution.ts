export class Solution {
    maxRepeating(sequence: string, word: string): number {
        let k = 0;
        let repeated = '';
        while (sequence.includes(repeated + word)) {
            repeated += word;
            k += 1;
        }
        return k;
    }
}
