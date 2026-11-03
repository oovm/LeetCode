export class Solution {
    canIWin(maxChoosableInteger: number, desiredTotal: number): boolean {
        const sum = (maxChoosableInteger * (maxChoosableInteger + 1)) / 2;
        if (sum < desiredTotal) {
            return false;
        }
        if (desiredTotal <= 0) {
            return true;
        }
        const memo = new Map<number, boolean>();
        const win = (used: number, remaining: number): boolean => {
            const cached = memo.get(used);
            if (cached !== undefined) {
                return cached;
            }
            for (let pick = 1; pick <= maxChoosableInteger; pick++) {
                const bit = 1 << pick;
                if ((used & bit) !== 0) {
                    continue;
                }
                if (pick >= remaining || !win(used | bit, remaining - pick)) {
                    memo.set(used, true);
                    return true;
                }
            }
            memo.set(used, false);
            return false;
        };
        return win(0, desiredTotal);
    }
}
