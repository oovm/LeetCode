export class Solution {
    threeSumMulti(arr: number[], target: number): number {
        const modulus = 1000000007;
        let highest = 0;
        for (const value of arr) {
            if (value > highest) {
                highest = value;
            }
        }
        const counts = new Array<number>(highest + 1).fill(0);
        for (const value of arr) {
            counts[value]++;
        }
        let total = 0;
        for (let first = 0; first <= highest; first++) {
            for (let second = first; second <= highest; second++) {
                const third = target - first - second;
                if (third < second || third > highest) {
                    continue;
                }
                const a = counts[first];
                const b = counts[second];
                const c = counts[third];
                let ways = 0;
                if (first === second && second === third) {
                    ways = (a * (a - 1) * (a - 2)) / 6;
                } else if (first === second) {
                    ways = ((a * (a - 1)) / 2) * c;
                } else if (second === third) {
                    ways = a * ((b * (b - 1)) / 2);
                } else {
                    ways = a * b * c;
                }
                total = (total + ways) % modulus;
            }
        }
        return total;
    }
}
