export class Solution {
    minimizeResult(expression: string): string {
        const plus = expression.indexOf('+');
        const left = expression.slice(0, plus);
        const right = expression.slice(plus + 1);
        let best = Infinity;
        let answer = '';
        for (let i = 0; i < left.length; i++) {
            const outsideL = i === 0 ? 1 : Number(left.slice(0, i));
            const insideL = Number(left.slice(i));
            for (let j = 1; j <= right.length; j++) {
                const insideR = Number(right.slice(0, j));
                const outsideR = j === right.length ? 1 : Number(right.slice(j));
                const value = outsideL * (insideL + insideR) * outsideR;
                if (value < best) {
                    best = value;
                    answer = `${left.slice(0, i)}(${left.slice(i)}+${right.slice(0, j)})${right.slice(j)}`;
                }
            }
        }
        return answer;
    }
}
