export class Solution {
    racecar(target: number): number {
        const queue: [number, number][] = [[0, 1]];
        const visited = new Set<string>(['0,1']);
        let steps = 0;
        while (queue.length > 0) {
            const next: [number, number][] = [];
            for (const [position, speed] of queue) {
                if (position === target) {
                    return steps;
                }
                for (const [np, ns] of [[position + speed, speed * 2], [position, speed > 0 ? -1 : 1]] as [number, number][]) {
                    if (np < 0 || np > 2 * target) {
                        continue;
                    }
                    const key = `${np},${ns}`;
                    if (!visited.has(key)) {
                        visited.add(key);
                        next.push([np, ns]);
                    }
                }
            }
            queue.splice(0, queue.length, ...next);
            steps += 1;
        }
        return -1;
    }
}
