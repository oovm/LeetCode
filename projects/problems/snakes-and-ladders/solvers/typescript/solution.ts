export class Solution {
    snakesAndLadders(board: number[][]): number {
        const n = board.length;
        const goal = n * n;
        const visited = new Array<boolean>(goal + 1).fill(false);
        const queue: number[] = [1];
        visited[1] = true;
        let head = 0;
        let rolls = 0;
        while (head < queue.length) {
            const level = queue.length - head;
            for (let taken = 0; taken < level; taken++) {
                const square = queue[head];
                head++;
                if (square === goal) {
                    return rolls;
                }
                const limit = Math.min(square + 6, goal);
                for (let next = square + 1; next <= limit; next++) {
                    const cell = Math.floor((next - 1) / n);
                    let col = (next - 1) % n;
                    if (cell % 2 === 1) {
                        col = n - col - 1;
                    }
                    const row = n - cell - 1;
                    const value = board[row][col];
                    const landing = value >= 0 ? value : next;
                    if (!visited[landing]) {
                        visited[landing] = true;
                        queue.push(landing);
                    }
                }
            }
            rolls++;
        }
        return -1;
    }
}
