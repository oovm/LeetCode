export class Solution {
    twoSum(numbers: number[], target: number): number[] | null {
        const bisectLeft = (x: number, lo: number): number => {
            let hi = numbers.length;
            while (lo < hi) {
                const mid = (lo + hi) >> 1;
                if (numbers[mid] < x) {
                    lo = mid + 1;
                } else {
                    hi = mid;
                }
            }
            return lo;
        };
        for (let i = 0; i + 1 < numbers.length; i++) {
            const x = target - numbers[i];
            const j = bisectLeft(x, i + 1);
            if (j < numbers.length && numbers[j] === x) {
                return [i + 1, j + 1];
            }
        }
        return null;
    }
}
