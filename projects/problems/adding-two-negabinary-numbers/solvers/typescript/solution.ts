export class Solution {
    addNegabinary(arr1: number[], arr2: number[]): number[] {
        const reversed: number[] = [];
        let i = arr1.length - 1;
        let j = arr2.length - 1;
        let carry = 0;
        while (i >= 0 || j >= 0 || carry !== 0) {
            let sum = carry;
            if (i >= 0) {
                sum += arr1[i];
                i--;
            }
            if (j >= 0) {
                sum += arr2[j];
                j--;
            }
            carry = 0;
            if (sum >= 2) {
                sum -= 2;
                carry = -1;
            } else if (sum === -1) {
                sum = 1;
                carry = 1;
            }
            reversed.push(sum);
        }
        const result = reversed.reverse();
        let start = 0;
        while (start + 1 < result.length && result[start] === 0) {
            start++;
        }
        return result.slice(start);
    }
}
