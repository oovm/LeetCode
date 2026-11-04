export class Solution {
    isOneBitCharacter(bits: number[]): boolean {
        let index = 0;
        while (index + 1 < bits.length) {
            index += bits[index] === 1 ? 2 : 1;
        }
        return index === bits.length - 1;
    }
}
