export class Solution {
    minimizedStringLength(s: string): number {
        return new Set(s).size;
    }
}
