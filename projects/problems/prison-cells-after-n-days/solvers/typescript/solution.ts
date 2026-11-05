export class Solution {
    prisonAfterNDays(cells: number[], n: number): number[] {
        const advance = (state: number): number => {
            const cells = new Array<number>(8).fill(0);
            let rest = state;
            for (let i = 7; i >= 0; i--) {
                cells[i] = rest % 2;
                rest = Math.floor(rest / 2);
            }
            let result = 0;
            for (let i = 0; i < 8; i++) {
                let bit = 0;
                if (i >= 1 && i <= 6 && cells[i - 1] === cells[i + 1]) {
                    bit = 1;
                }
                result = result * 2 + bit;
            }
            return result;
        };

        let state = 0;
        for (let i = 0; i < 8; i++) {
            state = state * 2 + cells[i];
        }
        const seen = new Map<number, number>();
        let step = 0;
        while (step < n) {
            if (seen.has(state)) {
                const cycle = step - seen.get(state)!;
                const remain = (n - step) % cycle;
                for (let r = 0; r < remain; r++) {
                    state = advance(state);
                }
                break;
            }
            seen.set(state, step);
            state = advance(state);
            step++;
        }
        const result = new Array<number>(8).fill(0);
        let rest = state;
        for (let i = 7; i >= 0; i--) {
            result[i] = rest % 2;
            rest = Math.floor(rest / 2);
        }
        return result;
    }
}
