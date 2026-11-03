export class Solution {
    minOperationsToFlip(expression: string): number {
        const values: number[] = [];
        const costs: number[] = [];
        const ops: string[] = [];
        const apply = (): void => {
            const cb = costs.pop()!;
            const vb = values.pop()!;
            const ca = costs.pop()!;
            const va = values.pop()!;
            const op = ops.pop()!;
            if (op === '&') {
                values.push(va & vb);
                if (va === 1 && vb === 1) costs.push(1 + Math.min(ca, cb));
                else if (va === 0 && vb === 0) costs.push(Math.min(ca + cb, 1 + Math.min(ca, cb)));
                else costs.push(1);
            } else {
                values.push(va | vb);
                if (va === 0 && vb === 0) costs.push(1 + Math.min(ca, cb));
                else if (va === 1 && vb === 1) costs.push(Math.min(ca + cb, 1 + Math.min(ca, cb)));
                else costs.push(1);
            }
        };
        for (const ch of expression) {
            if (ch === '0' || ch === '1') {
                values.push(Number(ch));
                costs.push(0);
            } else if (ch === '(' || ch === '&' || ch === '|') {
                ops.push(ch);
            } else if (ch === ')') {
                while (ops[ops.length - 1] !== '(') apply();
                ops.pop();
            }
            while (
                values.length >= 2 &&
                ops.length > 0 &&
                (ops[ops.length - 1] === '&' || ops[ops.length - 1] === '|') &&
                (ch === ')' || ch === '0' || ch === '1')
            ) {
                apply();
            }
        }
        while (ops.length > 0) apply();
        return costs[0];
    }
}
