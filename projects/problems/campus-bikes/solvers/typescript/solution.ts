export class Solution {
    assignBikes(workers: number[][], bikes: number[][]): number[] {
        const n = workers.length;
        const m = bikes.length;
        const keys: number[] = [];
        for (let i = 0; i < n; i += 1) {
            for (let j = 0; j < m; j += 1) {
                const distance =
                    Math.abs(workers[i][0] - bikes[j][0]) + Math.abs(workers[i][1] - bikes[j][1]);
                keys.push(distance * 1000000 + i * 1000 + j);
            }
        }
        keys.sort((a, b) => a - b);

        const workerTaken = new Array<boolean>(n).fill(false);
        const bikeTaken = new Array<boolean>(m).fill(false);
        const answer = new Array<number>(n).fill(0);
        for (const key of keys) {
            const bikeIndex = key % 1000;
            const workerIndex = Math.floor((key % 1000000) / 1000);
            if (!workerTaken[workerIndex] && !bikeTaken[bikeIndex]) {
                workerTaken[workerIndex] = true;
                bikeTaken[bikeIndex] = true;
                answer[workerIndex] = bikeIndex;
            }
        }
        return answer;
    }
}
