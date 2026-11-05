export class Solution {
    shiftingLetters(s: string, shifts: number[]): string {
        const length = s.length;
        const shifted = new Array<number>(length).fill(0);
        let carry = 0;
        for (let cursor = length - 1; cursor >= 0; cursor--) {
            if (cursor < shifts.length) {
                carry = (carry + shifts[cursor]) % 26;
            }
            const base = s.charCodeAt(cursor) - 97;
            shifted[cursor] = (base + carry) % 26;
        }
        let out = '';
        for (let index = 0; index < length; index++) {
            out += String.fromCharCode(shifted[index] + 97);
        }
        return out;
    }
}
