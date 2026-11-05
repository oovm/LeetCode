export class Solution {
    escapeGhosts(ghosts: number[][], target: number[]): boolean {
        const goal = Math.abs(target[0]) + Math.abs(target[1]);
        for (const ghost of ghosts) {
            const reach = Math.abs(ghost[0]) + Math.abs(ghost[1]);
            if (reach <= goal) {
                return false;
            }
        }
        return true;
    }
}
