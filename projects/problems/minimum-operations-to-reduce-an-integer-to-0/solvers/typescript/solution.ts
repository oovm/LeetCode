export class Solution {
    minOperations(n: number): number {
        let current = n;
        let operations = 0;
        while (current > 0) {
            if (current % 2 === 0) {
                current /= 2;
            } else if (current === 1 || current % 4 === 1) {
                current -= 1;
                operations += 1;
            } else {
                current += 1;
                operations += 1;
            }
        }
        return operations;
    }
}
