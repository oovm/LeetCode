export class Solution {
    isPathCrossing(path: string): boolean {
        const visited = new Set<string>(['0,0']);
        let x = 0;
        let y = 0;
        for (const move of path) {
            if (move === 'N') y += 1;
            else if (move === 'S') y -= 1;
            else if (move === 'E') x += 1;
            else x -= 1;
            const key = `${x},${y}`;
            if (visited.has(key)) {
                return true;
            }
            visited.add(key);
        }
        return false;
    }
}
