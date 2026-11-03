export class Solution {
    maxPotholes(road: string, budget: number): number {
        const runs: number[] = [];
        let i = 0;
        while (i < road.length) {
            if (road[i] === 'x') {
                let j = i;
                while (j < road.length && road[j] === 'x') j += 1;
                runs.push(j - i);
                i = j;
            } else {
                i += 1;
            }
        }
        runs.sort((a, b) => a - b);
        let fixed = 0;
        for (const len of runs) {
            for (let take = len; take > 0; take--) {
                const cost = take + 1;
                if (cost <= budget) {
                    budget -= cost;
                    fixed += take;
                    break;
                }
            }
        }
        return fixed;
    }
}
