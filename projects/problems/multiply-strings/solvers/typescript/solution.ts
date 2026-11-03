export class Solution {
    multiply(num1: string, num2: string): string {
        const product = new Array<number>(num1.length + num2.length).fill(0);
        for (let i = num1.length - 1; i >= 0; i--) {
            for (let j = num2.length - 1; j >= 0; j--) {
                const p = (num1.charCodeAt(i) - 48) * (num2.charCodeAt(j) - 48);
                const sum = p + product[i + j + 1];
                product[i + j + 1] = sum % 10;
                product[i + j] += Math.floor(sum / 10);
            }
        }
        const text = product.join('').replace(/^0+/, '');
        return text === '' ? '0' : text;
    }
}
