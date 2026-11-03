export class Solution {
    lengthLongestPath(input: string): number {
        const depthLen = new Map<number, number>([[-1, 0]]);
        let best = 0;
        for (const line of input.split('\n')) {
            const depth = line.lastIndexOf('\t') + 1;
            const name = line.slice(depth);
            const current = depthLen.get(depth - 1)! + name.length + 1;
            if (name.includes('.')) {
                best = Math.max(best, current - 1);
            } else {
                depthLen.set(depth, current);
            }
        }
        return best;
    }
}
