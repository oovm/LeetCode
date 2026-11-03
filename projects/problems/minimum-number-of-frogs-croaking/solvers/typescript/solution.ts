export class Solution {
    minNumberOfFrogs(croakOfFrogs: string): number {
        const stages = new Array<number>(5).fill(0);
        let frogs = 0;
        let best = 0;
        for (const ch of croakOfFrogs) {
            const idx = 'croak'.indexOf(ch);
            if (idx === 0) {
                frogs += 1;
                best = Math.max(best, frogs);
            } else if (stages[idx - 1] === 0) {
                return -1;
            } else {
                stages[idx - 1] -= 1;
            }
            stages[idx] += 1;
            if (idx === 4) {
                stages[4] -= 1;
                frogs -= 1;
            }
        }
        return frogs === 0 ? best : -1;
    }
}
