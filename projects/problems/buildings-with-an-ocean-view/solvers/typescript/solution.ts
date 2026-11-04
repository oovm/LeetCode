export class Solution {
    findBuildings(heights: number[]): number[] {
        const picked: number[] = [];
        let highest = -1;
        for (let position = heights.length - 1; position >= 0; position--) {
            if (heights[position] > highest) {
                picked.push(position);
                highest = heights[position];
            }
        }
        return picked.reverse();
    }
}
