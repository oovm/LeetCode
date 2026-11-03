export class Solution {
    isItPossible(word1: string, word2: string): boolean {
        const count = (w: string): number[] => {
            const c = new Array<number>(26).fill(0);
            for (const ch of w) c[ch.charCodeAt(0) - 97] += 1;
            return c;
        };
        const a = count(word1);
        const b = count(word2);
        const distinct = (c: number[]): number => c.filter((v) => v > 0).length;
        for (let i = 0; i < 26; i++) {
            if (a[i] === 0) continue;
            for (let j = 0; j < 26; j++) {
                if (b[j] === 0) continue;
                a[i] -= 1;
                a[j] += 1;
                b[j] -= 1;
                b[i] += 1;
                if (distinct(a) === distinct(b)) {
                    return true;
                }
                a[i] += 1;
                a[j] -= 1;
                b[j] += 1;
                b[i] -= 1;
            }
        }
        return false;
    }
}
