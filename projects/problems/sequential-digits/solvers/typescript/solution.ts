export class Solution {
    sequentialDigits(low: number, high: number): number[] {
        const answer: number[] = [];
        for (let width = 2; width <= 10; width++) {
            for (let start = 1; start <= 10 - width; start++) {
                let value = 0;
                for (let digit = start; digit < start + width; digit++) value = value * 10 + digit;
                if (value >= low && value <= high) answer.push(value);
            }
        }
        return answer;
    }
}
