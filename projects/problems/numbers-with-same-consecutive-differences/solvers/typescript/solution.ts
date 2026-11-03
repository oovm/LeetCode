export class Solution {
    numsSameConsecDiff(n: number, k: number): number[] {
        const digitCount = (value: number): number => {
            let count = 0;
            while (value > 0) {
                value = Math.floor(value / 10);
                count++;
            }
            return count;
        };
        const queue: number[] = [];
        for (let digit = 1; digit <= 9; digit++) queue.push(digit);
        const answer: number[] = [];
        let head = 0;
        while (head < queue.length) {
            const value = queue[head++];
            if (digitCount(value) === n) {
                answer.push(value);
                continue;
            }
            const last = value % 10;
            if (k === 0) {
                queue.push(value * 10 + last);
            } else {
                if (last + k <= 9) queue.push(value * 10 + last + k);
                if (last - k >= 0) queue.push(value * 10 + last - k);
            }
        }
        return answer;
    }
}
