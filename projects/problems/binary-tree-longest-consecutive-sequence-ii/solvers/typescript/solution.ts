export class Solution {
    longestConsecutive(root: number[]): number {
        let best = 0;
        const walk = (index: number): [number, number] => {
            if (index >= root.length) {
                return [0, 0];
            }
            const value = root[index];
            let incr = 1;
            let decr = 1;
            const left = index * 2 + 1;
            if (left < root.length) {
                const leftPair = walk(left);
                if (root[left] + 1 === value) {
                    incr = leftPair[0] + 1;
                }
                if (root[left] - 1 === value) {
                    decr = leftPair[1] + 1;
                }
            }
            const right = index * 2 + 2;
            if (right < root.length) {
                const rightPair = walk(right);
                if (root[right] + 1 === value) {
                    incr = Math.max(incr, rightPair[0] + 1);
                }
                if (root[right] - 1 === value) {
                    decr = Math.max(decr, rightPair[1] + 1);
                }
            }
            best = Math.max(best, incr + decr - 1);
            return [incr, decr];
        };
        walk(0);
        return best;
    }
}
