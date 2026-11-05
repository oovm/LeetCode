export class Solution {
    splitIntoFibonacci(num: string): number[] {
        const answer: number[] = [];
        this.extend(num, 0, answer);
        return answer;
    }

    private extend(num: string, start: number, answer: number[]): boolean {
        const length = num.length;
        if (start === length) {
            return answer.length > 2;
        }
        let value = 0;
        for (let cursor = start; cursor < length; cursor++) {
            if (cursor > start && num[start] === '0') {
                break;
            }
            value = value * 10 + Number(num[cursor]);
            if (value > 2147483647) {
                break;
            }
            if (answer.length >= 2) {
                const expected = answer[answer.length - 2] + answer[answer.length - 1];
                if (value > expected) {
                    break;
                }
                if (value < expected) {
                    continue;
                }
            }
            answer.push(value);
            if (this.extend(num, cursor + 1, answer)) {
                return true;
            }
            answer.pop();
        }
        return false;
    }
}
