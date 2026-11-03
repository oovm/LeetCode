export class Solution {
    complexNumberMultiply(num1: string, num2: string): string {
        const parse = (text: string): [number, number] => {
            const [real, imag] = text.slice(0, -1).split('+');
            return [Number(real), Number(imag)];
        };
        const [a, b] = parse(num1);
        const [c, d] = parse(num2);
        return `${a * c - b * d}+${a * d + b * c}i`;
    }
}
