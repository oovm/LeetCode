export class Solution {
    echoPlusOne(n: bigint | number): bigint | number {
        return typeof n === 'bigint' ? n + 1n : n + 1;
    }
}
