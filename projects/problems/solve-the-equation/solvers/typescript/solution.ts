export class Solution {
    solveEquation(equation: string): string {
        const parse = (side: string): [number, number] => {
            let coef = 0;
            let constant = 0;
            let sign = 1;
            let i = 0;
            while (i < side.length) {
                if (side[i] === '+') {
                    sign = 1;
                    i += 1;
                } else if (side[i] === '-') {
                    sign = -1;
                    i += 1;
                } else {
                    let value = 0;
                    let hasDigits = false;
                    while (i < side.length && side[i] >= '0' && side[i] <= '9') {
                        value = value * 10 + (side.charCodeAt(i) - 48);
                        hasDigits = true;
                        i += 1;
                    }
                    if (side[i] === 'x') {
                        coef += sign * (hasDigits ? value : 1);
                        i += 1;
                    } else {
                        constant += sign * value;
                    }
                }
            }
            return [coef, constant];
        };
        const [left, right] = equation.split('=');
        const [a, b] = parse(left);
        const [c, d] = parse(right);
        const coef = a - c;
        const constant = d - b;
        if (coef === 0) {
            return constant === 0 ? 'Infinite solutions' : 'No solution';
        }
        return `x=${constant / coef}`;
    }
}
