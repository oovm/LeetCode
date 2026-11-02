export class Solution {
    validUtf8(data: number[]): boolean {
        let remaining = 0;
        for (const v of data) {
            if (remaining > 0) {
                if (v >> 6 !== 0b10) {
                    return false;
                }
                remaining--;
            } else if (v >> 7 === 0) {
                remaining = 0;
            } else if (v >> 5 === 0b110) {
                remaining = 1;
            } else if (v >> 4 === 0b1110) {
                remaining = 2;
            } else if (v >> 3 === 0b11110) {
                remaining = 3;
            } else {
                return false;
            }
        }
        return remaining === 0;
    }
}
