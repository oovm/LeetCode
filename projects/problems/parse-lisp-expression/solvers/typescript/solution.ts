export class Solution {
    evaluate(expression: string): number {
        const parse = (tokens: string[], scope: Map<string, number>[]): number => {
            let i = 0;
            const evalAt = (): number => {
                if (tokens[i] !== '(') {
                    const token = tokens[i];
                    i += 1;
                    if (/^-?\d+$/.test(token)) return Number(token);
                    for (let s = scope.length - 1; s >= 0; s--) {
                        const hit = scope[s].get(token);
                        if (hit !== undefined) return hit;
                    }
                    return 0;
                }
                i += 1;
                const head = tokens[i];
                i += 1;
                let result = 0;
                if (head === 'add' || head === 'mult') {
                    result = head === 'add' ? evalAt() + evalAt() : evalAt() * evalAt();
                } else {
                    scope.push(new Map());
                    while (tokens[i] !== ')') {
                        if (/^[a-z][a-z0-9]*$/.test(tokens[i]) && tokens[i + 1] !== ')') {
                            const name = tokens[i];
                            i += 1;
                            const value = evalAt();
                            scope[scope.length - 1].set(name, value);
                            result = value;
                        } else {
                            result = evalAt();
                        }
                    }
                    scope.pop();
                }
                i += 1;
                return result;
            };
            return evalAt();
        };
        const tokens = expression.replaceAll('(', ' ( ').replaceAll(')', ' ) ').trim().split(/\s+/);
        return parse(tokens, [new Map()]);
    }
}
