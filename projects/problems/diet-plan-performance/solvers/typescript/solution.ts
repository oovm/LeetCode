export class Solution {
    dietPlanPerformance(
        calories: number[],
        k: number,
        lower: number,
        upper: number
    ): number {
        let points = 0;
        let sum = 0;
        for (let i = 0; i < calories.length; i++) {
            sum += calories[i];
            if (i >= k) sum -= calories[i - k];
            if (i >= k - 1) {
                if (sum < lower) points--;
                else if (sum > upper) points++;
            }
        }
        return points;
    }
}
