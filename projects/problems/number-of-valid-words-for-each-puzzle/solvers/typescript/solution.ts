export class Solution {
    findNumOfValidWords(words: string[], puzzles: string[]): number[] {
        const mask = (word: string): number => {
            let bits = 0;
            for (const ch of word) {
                bits |= 1 << (ch.charCodeAt(0) - 97);
            }
            return bits;
        };
        const masks = words.map(mask);
        const ans: number[] = [];
        for (const puzzle of puzzles) {
            const allowed = mask(puzzle);
            const required = 1 << (puzzle.charCodeAt(0) - 97);
            let count = 0;
            for (const candidate of masks) {
                if ((candidate & required) !== 0 && (candidate & allowed) === candidate) {
                    count++;
                }
            }
            ans.push(count);
        }
        return ans;
    }
}
