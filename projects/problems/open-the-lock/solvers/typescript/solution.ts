export class Solution {
    openLock(deadends: string[], target: string): number {
        const states = new Uint8Array(10000);
        for (const deadend of deadends) {
            states[Number(deadend)] = 2;
        }
        const goal = Number(target);
        if (states[0] === 2) {
            return -1;
        }
        if (goal === 0) {
            return 0;
        }
        const distance = new Int32Array(10000);
        const queue = new Int32Array(10000);
        let head = 0;
        let tail = 0;
        queue[tail++] = 0;
        states[0] = 1;
        while (head < tail) {
            const state = queue[head++];
            if (state === goal) {
                return distance[state];
            }
            let place = 1;
            for (let wheel = 0; wheel < 4; wheel++) {
                const digit = Math.floor(state / place) % 10;
                const options = [(digit + 1) % 10, (digit + 9) % 10];
                for (const nextDigit of options) {
                    const next = state + (nextDigit - digit) * place;
                    if (states[next] === 0) {
                        states[next] = 1;
                        distance[next] = distance[state] + 1;
                        queue[tail++] = next;
                    }
                }
                place *= 10;
            }
        }
        return -1;
    }
}
