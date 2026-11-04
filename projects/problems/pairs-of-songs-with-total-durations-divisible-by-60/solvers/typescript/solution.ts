export class Solution {
    numPairsDivisibleBy60(time: number[]): number {
        const counts = new Array<number>(60).fill(0);
        for (const value of time) counts[value % 60] += 1;
        let answer = 0;
        for (let remainder = 1; remainder < 30; remainder += 1) {
            answer += counts[remainder] * counts[60 - remainder];
        }
        answer += counts[0] * (counts[0] - 1) / 2;
        answer += counts[30] * (counts[30] - 1) / 2;
        return answer;
    }
}
