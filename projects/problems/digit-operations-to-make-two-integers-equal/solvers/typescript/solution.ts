function isPrime(x: number): boolean {
    if (x < 2) {
        return false;
    }
    for (let d = 2; d * d <= x; d++) {
        if (x % d === 0) {
            return false;
        }
    }
    return true;
}

export class Solution {
    minOperations(n: number, m: number): number {
        if (!isPrime(n) || !isPrime(m)) {
            return -1;
        }
        const digits = String(n).length;
        const visited = new Set<number>([n]);
        let queue: [number, number][] = [[n, 0]];
        while (queue.length > 0) {
            const next: [number, number][] = [];
            for (const [value, cost] of queue) {
                if (value === m) {
                    return cost + m;
                }
                for (let place = 1; place < 10 ** digits; place *= 10) {
                    const digit = Math.floor(value / place) % 10;
                    for (const delta of [-1, 1]) {
                        const target = digit + delta;
                        if (target < 0 || target > 9 || (place === 10 ** (digits - 1) && target === 0)) {
                            continue;
                        }
                        const candidate = value + delta * place;
                        if (isPrime(candidate) && !visited.has(candidate)) {
                            visited.add(candidate);
                            next.push([candidate, cost + candidate]);
                        }
                    }
                }
            }
            queue = next;
        }
        return -1;
    }
}
