export class Solution {
    findWords(words: string[]): string[] {
        const row = (c: string): number => {
            if ("qwertyuiop".includes(c)) return 0;
            if ("asdfghjkl".includes(c)) return 1;
            if ("zxcvbnm".includes(c)) return 2;
            return -1;
        };
        return words.filter((w) => {
            const r = row(w[0].toLowerCase());
            for (const c of w.toLowerCase()) {
                if (row(c) !== r) return false;
            }
            return true;
        });
    }
}
