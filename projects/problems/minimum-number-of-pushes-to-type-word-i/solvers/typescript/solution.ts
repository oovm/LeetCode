export class Solution {
    minimumPushes(word: string): number {
        const distinct = new Set(word).size;
        let pushes = 0;
        let remaining = distinct;
        for (let round = 1; remaining > 0; round++) {
            const take = Math.min(8, remaining);
            pushes += round * take;
            remaining -= take;
        }
        return pushes;
    }
}
