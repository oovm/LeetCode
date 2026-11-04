export class Solution {
    numRescueBoats(people: number[], limit: number): number {
        const ordered = [...people].sort((a, b) => a - b);
        let left = 0;
        let right = ordered.length - 1;
        let boats = 0;
        while (left <= right) {
            if (ordered[left] + ordered[right] <= limit) left += 1;
            right -= 1;
            boats += 1;
        }
        return boats;
    }
}
