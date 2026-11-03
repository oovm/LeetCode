export class Solution {
    maximumBinaryString(binary: string): string {
        const zeros = [...binary].filter((c) => c === '0').length;
        let leadingOnes = 0;
        while (leadingOnes < binary.length && binary[leadingOnes] === '1') {
            leadingOnes += 1;
        }
        if (zeros === 0) {
            return binary;
        }
        const pivot = leadingOnes + zeros - 1;
        return '1'.repeat(pivot) + '0' + '1'.repeat(binary.length - pivot - 1);
    }
}
