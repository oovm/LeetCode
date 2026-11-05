export class Solution {
    exclusiveTime(n: number, logs: string[]): number[] {
        const answer = new Array<number>(n).fill(0);
        const stack: number[] = [];
        let previous = 0;
        for (const log of logs) {
            const [identifier, operation, stamp] = log.split(":");
            const id = Number(identifier);
            const time = Number(stamp);
            if (operation[0] === "s") {
                if (stack.length > 0) {
                    answer[stack[stack.length - 1]] += time - previous;
                }
                stack.push(id);
                previous = time;
            } else {
                const finished = stack.pop() as number;
                answer[finished] += time - previous + 1;
                previous = time + 1;
            }
        }
        return answer;
    }
}
