export class Solution {
    asteroidCollision(asteroids: number[]): number[] {
        const stack: number[] = [];
        for (const rock of asteroids) {
            if (rock > 0) {
                stack.push(rock);
                continue;
            }
            let alive = true;
            while (alive && stack.length > 0 && stack[stack.length - 1] > 0) {
                const top = stack[stack.length - 1];
                if (top < -rock) {
                    stack.pop();
                } else if (top === -rock) {
                    stack.pop();
                    alive = false;
                } else {
                    alive = false;
                }
            }
            if (alive) {
                stack.push(rock);
            }
        }
        return stack;
    }
}
