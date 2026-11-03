export class Solution {
    isTransformable(s: string, t: string): boolean {
        const queues: number[][] = Array.from({ length: 10 }, () => []);
        for (let i = 0; i < s.length; i++) {
            queues[s.charCodeAt(i) - 48].push(i);
        }
        for (const ch of t) {
            const d = ch.charCodeAt(0) - 48;
            if (queues[d].length === 0) return false;
            const pos = queues[d].shift()!;
            for (let smaller = 0; smaller < d; smaller++) {
                if (queues[smaller].length > 0 && queues[smaller][0] < pos) {
                    return false;
                }
            }
        }
        return true;
    }
}
