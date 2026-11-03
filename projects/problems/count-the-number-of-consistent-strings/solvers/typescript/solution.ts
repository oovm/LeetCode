export class Solution {
    countConsistentStrings(allowed: string, words: string[]): number {
        const set = new Set(allowed);
        let count = 0;
        for (const word of words) {
            let ok = true;
            for (const c of word) {
                if (!set.has(c)) {
                    ok = false;
                    break;
                }
            }
            if (ok) count++;
        }
        return count;
    }
}
