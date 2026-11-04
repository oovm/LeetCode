export class Solution {
    asteroidsDestroyed(mass: number, asteroids: number[]): boolean {
        const ordered = [...asteroids].sort((a, b) => a - b);
        let current = mass;
        for (const value of ordered) {
            if (current < value) return false;
            current += value;
        }
        return true;
    }
}
