export class Solution {
    minimumPerimeter(neededApples: number): number {
        let k = 0;
        while (2 * k * (k + 1) * (2 * k + 1) < neededApples) {
            k += 1;
        }
        return 8 * k;
    }
}
