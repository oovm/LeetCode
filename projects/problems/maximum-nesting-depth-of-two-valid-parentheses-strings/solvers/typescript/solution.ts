export class Solution {
    maxDepthAfterSplit(seq: string): number[] {
        const answer = new Array<number>(seq.length).fill(0);
        let depth = 0;
        for (let index = 0; index < seq.length; index += 1) {
            if (seq[index] === '(') {
                answer[index] = depth & 1;
                depth += 1;
            } else {
                depth -= 1;
                answer[index] = depth & 1;
            }
        }
        return answer;
    }
}
