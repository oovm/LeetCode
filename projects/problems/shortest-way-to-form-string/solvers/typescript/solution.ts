export class Solution {
    shortestWay(target: string, source: string): number {
        let rounds = 0;
        let i = 0;
        while (i < target.length) {
            let advanced = false;
            for (const ch of source) {
                if (i < target.length && ch === target[i]) {
                    i += 1;
                    advanced = true;
                }
            }
            if (!advanced) {
                return -1;
            }
            rounds += 1;
        }
        return rounds;
    }
}
