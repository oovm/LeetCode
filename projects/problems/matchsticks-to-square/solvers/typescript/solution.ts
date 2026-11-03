export class Solution {
    makesquare(matchsticks: number[]): boolean {
        const total = matchsticks.reduce((a, b) => a + b, 0);
        if (total % 4 !== 0) return false;
        const side = total / 4;
        matchsticks.sort((a, b) => b - a);
        const sides = new Array<number>(4).fill(0);
        const dfs = (i: number): boolean => {
            if (i === matchsticks.length) return sides.every((s) => s === side);
            for (let k = 0; k < 4; k++) {
                if (sides[k] + matchsticks[i] > side) continue;
                sides[k] += matchsticks[i];
                if (dfs(i + 1)) return true;
                sides[k] -= matchsticks[i];
                if (sides[k] === 0) break;
            }
            return false;
        };
        return dfs(0);
    }
}
