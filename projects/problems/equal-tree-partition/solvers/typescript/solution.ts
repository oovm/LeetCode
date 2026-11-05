export class Solution {
    checkEqualTree(root: number[]): boolean {
        const totalNodes = root.length;
        if (totalNodes === 0) {
            return false;
        }
        const sums = new Array<number>(totalNodes).fill(0);
        let total = 0;
        for (let index = totalNodes - 1; index >= 0; index--) {
            sums[index] += root[index];
            total += root[index];
            if (index > 0) {
                const parent = Math.floor((index - 1) / 2);
                sums[parent] += sums[index];
            }
        }
        if (total % 2 !== 0) {
            return false;
        }
        const half = total / 2;
        for (let index = 1; index < totalNodes; index++) {
            if (sums[index] === half) {
                return true;
            }
        }
        return false;
    }
}
