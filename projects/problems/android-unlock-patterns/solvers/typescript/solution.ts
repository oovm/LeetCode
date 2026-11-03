export class Solution {
    numberOfPatterns(m: number, n: number): number {
        const skip = Array.from({ length: 9 }, () => new Array<number>(9).fill(0));
        skip[0]![2] = 1; skip[2]![0] = 1;
        skip[3]![5] = 4; skip[5]![3] = 4;
        skip[6]![8] = 7; skip[8]![6] = 7;
        skip[0]![6] = 3; skip[6]![0] = 3;
        skip[1]![7] = 4; skip[7]![1] = 4;
        skip[2]![8] = 5; skip[8]![2] = 5;
        skip[0]![8] = 4; skip[8]![0] = 4;
        skip[2]![6] = 4; skip[6]![2] = 4;
        const visited = new Array<boolean>(9).fill(false);
        const dfs = (current: number, remaining: number): number => {
            if (remaining === 0) {
                return 1;
            }
            let total = 0;
            for (let next = 0; next < 9; next++) {
                if (visited[next]) {
                    continue;
                }
                const via = skip[current]![next] as number;
                if (via !== 0 && !visited[via]) {
                    continue;
                }
                visited[next] = true;
                total += dfs(next, remaining - 1);
                visited[next] = false;
            }
            return total;
        };
        const countFrom = (start: number): number => {
            visited.fill(false);
            visited[start] = true;
            let total = 0;
            for (let length = m; length <= n; length++) {
                total += dfs(start, length - 1);
            }
            return total;
        };
        // 角（0 类）×4、边（1 类）×4、中心 ×1。
        return countFrom(0) * 4 + countFrom(1) * 4 + countFrom(4);
    }
}
