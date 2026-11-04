function digitSum(value: number): number {
    let rest = value;
    let sum = 0;
    while (rest > 0) {
        sum += rest % 10;
        rest = Math.floor(rest / 10);
    }
    return sum;
}

export class Solution {
    maximumSum(nums: number[]): number {
        const largest = new Map<number, number>();
        let answer = -1;
        for (const value of nums) {
            const key = digitSum(value);
            const previous = largest.get(key);
            if (previous === undefined) {
                largest.set(key, value);
                continue;
            }
            answer = Math.max(answer, previous + value);
            if (value > previous) largest.set(key, value);
        }
        return answer;
    }
}
