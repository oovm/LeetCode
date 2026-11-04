export class Solution {
    diffWaysToCompute(expression: string): number[] {
        const memo = new Map<string, number[]>();
        const solve = (text: string): number[] => {
            const cached = memo.get(text);
            if (cached) {
                return cached;
            }
            const result: number[] = [];
            let split = false;
            for (let i = 0; i < text.length; i++) {
                const ch = text[i];
                if (ch === "+" || ch === "-" || ch === "*") {
                    split = true;
                    const lefts = solve(text.slice(0, i));
                    const rights = solve(text.slice(i + 1));
                    for (const left of lefts) {
                        for (const right of rights) {
                            if (ch === "+") result.push(left + right);
                            else if (ch === "-") result.push(left - right);
                            else result.push(left * right);
                        }
                    }
                }
            }
            if (!split) {
                result.push(Number(text));
            }
            memo.set(text, result);
            return result;
        };
        return solve(expression);
    }
}
