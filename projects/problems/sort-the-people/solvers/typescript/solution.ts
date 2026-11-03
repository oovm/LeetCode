export class Solution {
    sortPeople(names: string[], heights: number[]): string[] {
        return names
            .map((name, i) => [name, heights[i]] as const)
            .sort((a, b) => b[1] - a[1])
            .map(([name]) => name);
    }
}
