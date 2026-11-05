export class Solution {
    pathInZigZagTree(label: number): number[] {
        let depth = 1;
        let first = 1;
        while (first * 2 <= label) {
            first *= 2;
            depth += 1;
        }
        const answer = new Array<number>(depth);
        let current = label;
        for (let level = depth; level > 0; level -= 1) {
            answer[level - 1] = current;
            const low = 2 ** (level - 1);
            const high = 2 ** level - 1;
            current = (low + high - current) >> 1;
        }
        return answer;
    }
}
