export class Solution {
    countValidWords(sentence: string): number {
        const isLetter = (c: string): boolean =>
            (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
        const isMark = (c: string): boolean => c === '.' || c === ',' || c === '!';
        const isDigit = (c: string): boolean => c >= '0' && c <= '9';
        let count = 0;
        const words = sentence.trim().split(/\s+/);
        for (const word of words) {
            if (word.length === 0) {
                continue;
            }
            let valid = true;
            let hyphens = 0;
            let marks = 0;
            for (let i = 0; i < word.length; i++) {
                const c = word[i];
                if (isLetter(c)) {
                    continue;
                }
                if (c === '-') {
                    hyphens++;
                    if (
                        hyphens > 1 ||
                        i === 0 ||
                        i + 1 >= word.length ||
                        !isLetter(word[i - 1]) ||
                        !isLetter(word[i + 1])
                    ) {
                        valid = false;
                    }
                } else if (isMark(c)) {
                    marks++;
                    if (marks > 1 || i + 1 !== word.length) {
                        valid = false;
                    }
                } else if (isDigit(c)) {
                    valid = false;
                }
            }
            if (valid) {
                count++;
            }
        }
        return count;
    }
}
