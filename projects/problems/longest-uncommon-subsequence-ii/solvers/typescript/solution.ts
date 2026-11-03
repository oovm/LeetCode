export class Solution {
    findLUSlength(strs: string[]): number {
        const isSubseq = (a: string, b: string) => {
            let i = 0;
            for (const ch of b) if (a[i] === ch) i++;
            return i === a.length;
        };
        let best = -1;
        outer: for (let i = 0; i < strs.length; i++) {
            for (let j = 0; j < strs.length; j++) {
                if (i !== j && isSubseq(strs[i], strs[j])) continue outer;
            }
            best = Math.max(best, strs[i].length);
        }
        return best;
    }
}
