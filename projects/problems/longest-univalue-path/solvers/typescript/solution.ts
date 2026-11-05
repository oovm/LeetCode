export class Solution {
    longestUnivaluePath(root: number[]): number {
        const total = root.length;
        if (total === 0) {
            return 0;
        }
        const down = new Array<number>(total).fill(0);
        let best = 0;
        for (let index = total - 1; index >= 0; index--) {
            const left = index * 2 + 1;
            const right = left + 1;
            let armLeft = 0;
            let armRight = 0;
            if (left < total && root[left] === root[index]) {
                armLeft = down[left] + 1;
            }
            if (right < total && root[right] === root[index]) {
                armRight = down[right] + 1;
            }
            down[index] = Math.max(armLeft, armRight);
            best = Math.max(best, armLeft + armRight);
        }
        return best;
    }
}
