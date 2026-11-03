export class Solution {
    encode(num: number): string {
        return (num + 1).toString(2).slice(1);
    }
}
