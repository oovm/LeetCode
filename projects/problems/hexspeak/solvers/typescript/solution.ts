export class Solution {
    toHexspeak(num: string): string {
        const mapped = BigInt(num)
            .toString(16)
            .toUpperCase()
            .replaceAll('0', 'O')
            .replaceAll('1', 'I');
        return /^[A-FIO]+$/.test(mapped) ? mapped : 'ERROR';
    }
}
