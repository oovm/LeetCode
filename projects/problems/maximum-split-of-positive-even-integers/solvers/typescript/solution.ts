export class Solution {
    maximumEvenSplit(finalSum: number): number[] {
        const answer: number[] = [];
        if (finalSum % 2 !== 0) return answer;
        let remaining = finalSum;
        let next = 2;
        while (remaining >= next) {
            answer.push(next);
            remaining -= next;
            next += 2;
        }
        if (remaining > 0) answer[answer.length - 1] += remaining;
        return answer;
    }
}
