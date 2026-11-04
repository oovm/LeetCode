export class Solution {
    loudAndRich(richer: number[][], quiet: number[]): number[] {
        const count = quiet.length;
        const graph: number[][] = Array.from({ length: count }, () => []);
        for (const [rich, poor] of richer) {
            graph[poor].push(rich);
        }

        const result: number[] = [];
        for (let person = 0; person < count; person += 1) {
            const visited = new Array<boolean>(count).fill(false);
            const stack: number[] = [person];
            visited[person] = true;
            let best = person;
            while (stack.length > 0) {
                const current = stack.pop() as number;
                if (quiet[current] < quiet[best]) best = current;
                for (const next of graph[current]) {
                    if (!visited[next]) {
                        visited[next] = true;
                        stack.push(next);
                    }
                }
            }
            result.push(best);
        }
        return result;
    }
}
