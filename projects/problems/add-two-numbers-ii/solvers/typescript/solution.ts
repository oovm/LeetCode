export class Solution {
    addTwoNumbers(l1: number[], l2: number[]): number[] {
        const s1 = [...l1].reverse();
        const s2 = [...l2].reverse();
        const result: number[] = [];
        let carry = 0;
        for (let i = 0; i < Math.max(s1.length, s2.length) || carry; i++) {
            const sum = (s1[i] ?? 0) + (s2[i] ?? 0) + carry;
            result.push(sum % 10);
            carry = Math.floor(sum / 10);
        }
        return result.reverse();
    }
}
