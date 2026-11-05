export class Solution {
    minDominoRotations(tops: number[], bottoms: number[]): number {
        const rotations = (target: number): number => {
            let up = 0;
            let down = 0;
            for (let i = 0; i < tops.length; i++) {
                if (tops[i] !== target && bottoms[i] !== target) {
                    return -1;
                }
                if (tops[i] !== target) {
                    up++;
                }
                if (bottoms[i] !== target) {
                    down++;
                }
            }
            return Math.min(up, down);
        };
        const first = rotations(tops[0]);
        const second = rotations(bottoms[0]);
        if (first < 0) {
            return second;
        }
        if (second < 0) {
            return first;
        }
        return Math.min(first, second);
    }
}
