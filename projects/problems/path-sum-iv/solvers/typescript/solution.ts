export class Solution {
    pathSum(nums: number[]): number {
        const values = new Map<number, number>();
        for (const encoded of nums) {
            values.set(Math.floor(encoded / 10), encoded % 10);
        }
        let answer = 0;
        const walk = (node: number, carried: number): void => {
            if (!values.has(node)) {
                return;
            }
            const sum = carried + values.get(node)!;
            const depth = Math.floor(node / 10);
            const position = node % 10;
            const left = (depth + 1) * 10 + position * 2 - 1;
            const right = left + 1;
            if (!values.has(left) && !values.has(right)) {
                answer += sum;
                return;
            }
            walk(left, sum);
            walk(right, sum);
        };
        walk(11, 0);
        return answer;
    }
}
