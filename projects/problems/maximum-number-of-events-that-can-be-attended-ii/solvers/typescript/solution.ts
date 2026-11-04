export class Solution {
    maxValue(events: number[][], k: number): number {
        const rows = events
            .map(([start, end, value]) => ({ start, end, value }))
            .sort((left, right) => left.start - right.start || left.end - right.end || left.value - right.value);
        const starts = rows.map((row) => row.start);
        const count = rows.length;

        const firstStartAfter = (value: number): number => {
            let low = 0;
            let high = count;
            while (low < high) {
                const middle = low + Math.floor((high - low) / 2);
                if (starts[middle] <= value) {
                    low = middle + 1;
                } else {
                    high = middle;
                }
            }
            return low;
        };

        let previous = new Array<number>(count + 1).fill(0);
        for (let round = 0; round < k; round++) {
            const current = new Array<number>(count + 1).fill(0);
            for (let index = count - 1; index >= 0; index--) {
                const take = rows[index].value + previous[firstStartAfter(rows[index].end)];
                current[index] = Math.max(current[index + 1], take);
            }
            previous = current;
        }
        return previous[0];
    }
}
