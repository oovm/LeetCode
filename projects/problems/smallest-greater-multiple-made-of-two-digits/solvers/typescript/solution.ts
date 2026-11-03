export class Solution {
    findInteger(k: number, digit1: number, digit2: number): number {
        const digits = digit1 < digit2 ? [digit1, digit2] : [digit2, digit1];
        const [small, large] = digits as [number, number];
        if (small === 0 && large === 0) {
            return -1;
        }
        let queue: number[] = [];
        for (const d of digits) {
            if (d > 0) {
                queue.push(d);
            }
        }
        const seen = new Set<number>();
        while (queue.length > 0) {
            const next: number[] = [];
            for (const value of queue) {
                if (value > k && value % k === 0) {
                    return value;
                }
                if (value > Number.MAX_SAFE_INTEGER / 10) {
                    continue;
                }
                for (const d of digits) {
                    const candidate = value * 10 + d;
                    if (!seen.has(candidate)) {
                        seen.add(candidate);
                        next.push(candidate);
                    }
                }
            }
            queue = next;
        }
        return -1;
    }
}
