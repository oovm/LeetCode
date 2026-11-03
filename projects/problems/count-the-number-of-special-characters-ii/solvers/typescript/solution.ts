export class Solution {
    numberOfSpecialChars(word: string): number {
        const lastLower = new Array<number>(26).fill(-1);
        const firstUpper = new Array<number>(26).fill(Infinity);
        for (let i = 0; i < word.length; i++) {
            const code = word.charCodeAt(i);
            if (code >= 97) lastLower[code - 97] = i;
            else if (firstUpper[code - 65] === Infinity) firstUpper[code - 65] = i;
        }
        let count = 0;
        for (let c = 0; c < 26; c++) {
            if (lastLower[c] !== -1 && firstUpper[c] !== Infinity && lastLower[c] < firstUpper[c]) {
                count += 1;
            }
        }
        return count;
    }
}
