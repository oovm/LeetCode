export class Solution {
    isNumber(s: string): boolean {
        return /^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(s.trim());
    }
}
