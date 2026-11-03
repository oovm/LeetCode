export class Solution {
    parseBoolExpr(expression: string): boolean {
        let i = 0;
        const parse = (): boolean => {
            const ch = expression[i];
            if (ch === 't') {
                i += 1;
                return true;
            }
            if (ch === 'f') {
                i += 1;
                return false;
            }
            const op = ch;
            i += 2;
            const values: boolean[] = [];
            while (expression[i] !== ')') {
                values.push(parse());
                if (expression[i] === ',') i += 1;
            }
            i += 1;
            if (op === '!') return !values[0];
            if (op === '&') return values.every(Boolean);
            return values.some(Boolean);
        };
        return parse();
    }
}
