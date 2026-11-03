export class Solution {
    reformatNumber(number: string): string {
        const digits = number.replaceAll('-', '').replaceAll(' ', '');
        const groups: string[] = [];
        let i = 0;
        while (digits.length - i > 4) {
            groups.push(digits.slice(i, i + 3));
            i += 3;
        }
        if (digits.length - i === 4) {
            groups.push(digits.slice(i, i + 2), digits.slice(i + 2));
        } else {
            groups.push(digits.slice(i));
        }
        return groups.join('-');
    }
}
