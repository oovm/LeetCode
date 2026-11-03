export class Solution {
    countSteppingNumbers(low: number, high: number): number[] {
        const queue: number[] = [];
        for (let digit = 0; digit <= 9; digit++) queue.push(digit);
        const answer: number[] = [];
        let head = 0;
        while (head < queue.length) {
            const value = queue[head++];
            if (value >= low && value <= high) answer.push(value);
            if (value > 0) {
                const last = value % 10;
                if (last > 0) {
                    const next = value * 10 + last - 1;
                    if (next <= high) queue.push(next);
                }
                if (last < 9) {
                    const next = value * 10 + last + 1;
                    if (next <= high) queue.push(next);
                }
            }
        }
        return answer;
    }
}
