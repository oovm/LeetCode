export class Solution {
    partitionLabels(s: string): number[] {
        const last = new Array<number>(26).fill(0);
        const size = s.length;
        for (let index = 0; index < size; index++) {
            last[s.charCodeAt(index) - 97] = index;
        }
        const out: number[] = [];
        let start = 0;
        let end = 0;
        for (let index = 0; index < size; index++) {
            end = Math.max(end, last[s.charCodeAt(index) - 97]);
            if (index === end) {
                out.push(end - start + 1);
                start = index + 1;
            }
        }
        return out;
    }
}
