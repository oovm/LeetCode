export class Solution {
    fullBloomFlowers(flowers: number[][], people: number[]): number[] {
        const starts = flowers.map((flower) => flower[0]).sort((left, right) => left - right);
        const ends = flowers.map((flower) => flower[1]).sort((left, right) => left - right);

        const upperBound = (values: number[], target: number): number => {
            let low = 0;
            let high = values.length;
            while (low < high) {
                const middle = low + Math.floor((high - low) / 2);
                if (values[middle] <= target) {
                    low = middle + 1;
                } else {
                    high = middle;
                }
            }
            return low;
        };

        const lowerBound = (values: number[], target: number): number => {
            let low = 0;
            let high = values.length;
            while (low < high) {
                const middle = low + Math.floor((high - low) / 2);
                if (values[middle] < target) {
                    low = middle + 1;
                } else {
                    high = middle;
                }
            }
            return low;
        };

        return people.map((person) => upperBound(starts, person) - lowerBound(ends, person));
    }
}
