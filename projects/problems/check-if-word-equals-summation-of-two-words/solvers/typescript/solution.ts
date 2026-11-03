export class Solution {
    isSumEqual(firstWord: string, targetWord: string, secondWord: string): boolean {
        const value = (word: string): number => {
            let v = 0;
            for (const ch of word) {
                v = v * 10 + (ch.charCodeAt(0) - 97);
            }
            return v;
        };
        return value(firstWord) + value(secondWord) === value(targetWord);
    }
}
