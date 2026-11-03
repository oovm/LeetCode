export class Solution {
    getDecimalValue(head: number[]): number {
        let value = 0;
        for (const bit of head) value = value * 2 + bit;
        return value;
    }
}
