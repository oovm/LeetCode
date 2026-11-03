export class Solution {
    minimumBoxes(apple: number[], capacity: number[]): number {
        let total = apple.reduce((a, b) => a + b, 0);
        capacity.sort((a, b) => b - a);
        let boxes = 0;
        while (total > 0) total -= capacity[boxes++];
        return boxes;
    }
}
