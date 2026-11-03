export class Solution {
    minCharacters(a: string, b: string): number {
        const ca = new Array<number>(26).fill(0);
        const cb = new Array<number>(26).fill(0);
        for (const ch of a) ca[ch.charCodeAt(0) - 97] += 1;
        for (const ch of b) cb[ch.charCodeAt(0) - 97] += 1;
        let best = a.length + b.length - Math.max(...ca) - Math.max(...cb);
        let prefixA = 0;
        let prefixB = 0;
        for (let i = 0; i < 25; i++) {
            prefixA += ca[i];
            prefixB += cb[i];
            best = Math.min(best, a.length - prefixA + prefixB, b.length - prefixB + prefixA);
        }
        return best;
    }
}
