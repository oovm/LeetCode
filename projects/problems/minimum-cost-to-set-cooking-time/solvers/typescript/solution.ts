export class Solution {
    minCostSetTime(startAt: number, moveCost: number, pushCost: number, targetSeconds: number): number {
        let best = Infinity;
        for (let m = 0; m <= 99; m++) {
            const s = targetSeconds - 60 * m;
            if (s < 0 || s > 99) {
                continue;
            }
            const digits = [...(m > 0 ? String(m) : ''), ...String(s).padStart(2, '0')];
            let cost = 0;
            let prev = startAt;
            for (const d of digits) {
                const v = d.charCodeAt(0) - 48;
                if (v !== prev) {
                    cost += moveCost;
                }
                cost += pushCost;
                prev = v;
            }
            best = Math.min(best, cost);
        }
        return best;
    }
}
