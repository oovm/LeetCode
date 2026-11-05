export class Solution {
    minAreaRect(points: number[][]): number {
        const base = 80001;
        const offset = 40000;
        const keys = points.map(([x, y]) => (x + offset) * base + (y + offset));
        keys.sort((a, b) => a - b);
        const previous = new Map<number, number>();
        let best = -1;
        let start = 0;
        while (start < keys.length) {
            const x = Math.floor(keys[start] / base) - offset;
            let stop = start;
            while (stop < keys.length && Math.floor(keys[stop] / base) === Math.floor(keys[start] / base)) {
                stop++;
            }
            for (let first = start; first < stop; first++) {
                const low = (keys[first] % base) - offset;
                for (let second = first + 1; second < stop; second++) {
                    const high = (keys[second] % base) - offset;
                    const pair = (low + offset) * base + (high + offset);
                    const seen = previous.get(pair);
                    if (seen !== undefined) {
                        const area = (x - seen) * (high - low);
                        if (best < 0 || area < best) {
                            best = area;
                        }
                    }
                    previous.set(pair, x);
                }
            }
            start = stop;
        }
        return best < 0 ? 0 : best;
    }
}
