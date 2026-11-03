export class Solution {
    getMaxRepetitions(s1: string, s2: string, n2: number, n1: number): number {
        const nextIdx = new Array<number>(s2.length);
        const countAt = new Array<number>(s2.length);
        let idx = 0;
        let count = 0;
        for (let round = 0; round < n1; round++) {
            for (const ch of s1) {
                if (ch === s2[idx]) {
                    idx += 1;
                    if (idx === s2.length) {
                        idx = 0;
                        count += 1;
                    }
                }
            }
            if (nextIdx[idx] !== undefined) {
                const prevRound = nextIdx[idx];
                const prevCount = countAt[idx];
                const cycleRounds = round - prevRound;
                const cycleCounts = count - prevCount;
                const cycles = Math.floor((n1 - round - 1) / cycleRounds);
                count += cycles * cycleCounts;
                round += cycles * cycleRounds;
            } else {
                nextIdx[idx] = round;
                countAt[idx] = count;
            }
        }
        return Math.floor(count / n2);
    }
}
