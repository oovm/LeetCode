export class Solution {
    maxHeight(cuboids: number[][]): number {
        const rows = cuboids.map((dims) => [...dims].sort((left, right) => left - right));
        rows.sort((left, right) => left[0] - right[0] || left[1] - right[1] || left[2] - right[2]);

        const heights = new Array<number>(rows.length).fill(0);
        let best = 0;
        for (let index = 0; index < rows.length; index++) {
            let height = rows[index][2];
            for (let below = 0; below < index; below++) {
                if (
                    rows[below][0] <= rows[index][0] &&
                    rows[below][1] <= rows[index][1] &&
                    rows[below][2] <= rows[index][2]
                ) {
                    height = Math.max(height, heights[below] + rows[index][2]);
                }
            }
            heights[index] = height;
            best = Math.max(best, height);
        }
        return best;
    }
}
