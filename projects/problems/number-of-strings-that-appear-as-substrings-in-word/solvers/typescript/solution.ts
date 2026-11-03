export class Solution {
    numOfStrings(patterns: string[], word: string): number {
        return patterns.filter((p) => word.includes(p)).length;
    }
}
