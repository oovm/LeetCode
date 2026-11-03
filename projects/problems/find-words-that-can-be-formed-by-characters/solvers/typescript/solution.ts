export class Solution {
    countCharacters(words: string[], chars: string): number {
        const pool = new Array(26).fill(0);
        for (const c of chars) pool[c.charCodeAt(0) - 97]++;
        let total = 0;
        for (const word of words) {
            const need = new Array(26).fill(0);
            let ok = true;
            for (const c of word) {
                const i = c.charCodeAt(0) - 97;
                need[i]++;
                if (need[i] > pool[i]) {
                    ok = false;
                    break;
                }
            }
            if (ok) total += word.length;
        }
        return total;
    }
}
