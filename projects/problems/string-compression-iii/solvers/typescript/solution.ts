export class Solution {
    compressedString(word: string): string {
        const out: string[] = [];
        let i = 0;
        while (i < word.length) {
            let j = i;
            while (j < word.length && word[j] === word[i] && j - i < 9) j += 1;
            out.push(`${j - i}${word[i]}`);
            i = j;
        }
        return out.join('');
    }
}
