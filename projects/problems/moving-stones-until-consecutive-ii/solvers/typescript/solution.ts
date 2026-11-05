export class Solution {
    numMovesStonesII(stones: number[]): number[] {
        stones.sort((a, b) => a - b);
        const count = stones.length;
        const spanLeft = stones[count - 1] - stones[1] + 1;
        const spanRight = stones[count - 2] - stones[0] + 1;
        const maximum = Math.max(spanLeft, spanRight) - (count - 1);
        let minimum = count;
        let left = 0;
        for (let right = 0; right < count; right++) {
            const far = stones[right];
            while (far - stones[left] + 1 > count) {
                left++;
            }
            const covered = right - left + 1;
            if (covered === count - 1 && far - stones[left] === count - 2) {
                minimum = Math.min(minimum, 2);
            } else {
                minimum = Math.min(minimum, count - covered);
            }
        }
        return [minimum, maximum];
    }
}
