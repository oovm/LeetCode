export class Solution {
    canWin(currentState: string): boolean {
        const memo = new Map<string, boolean>();
        const win = (state: string): boolean => {
            const hit = memo.get(state);
            if (hit !== undefined) {
                return hit;
            }
            for (let i = 0; i + 1 < state.length; i++) {
                if (state[i] === '+' && state[i + 1] === '+') {
                    const next = state.slice(0, i) + '--' + state.slice(i + 2);
                    if (!win(next)) {
                        memo.set(state, true);
                        return true;
                    }
                }
            }
            memo.set(state, false);
            return false;
        };
        return win(currentState);
    }
}
