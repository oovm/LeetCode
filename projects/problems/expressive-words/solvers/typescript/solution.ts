export class Solution {
    expressiveWords(s: string, words: string[]): number {
        return words.filter((word) => this.stretchy(s, word)).length;
    }

    private stretchy(s: string, t: string): boolean {
        const m = s.length;
        const n = t.length;
        if (n > m) {
            return false;
        }
        let i = 0;
        let j = 0;
        while (i < m && j < n) {
            if (s[i] !== t[j]) {
                return false;
            }
            let cursor = i;
            while (cursor < m && s[cursor] === s[i]) {
                cursor++;
            }
            const first = cursor - i;
            i = cursor;
            cursor = j;
            while (cursor < n && t[cursor] === t[j]) {
                cursor++;
            }
            const second = cursor - j;
            j = cursor;
            if (first < second || (first < 3 && first !== second)) {
                return false;
            }
        }
        return i === m && j === n;
    }
}
