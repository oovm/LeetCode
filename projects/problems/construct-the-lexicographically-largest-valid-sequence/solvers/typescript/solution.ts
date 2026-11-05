export class Solution {
    constructDistancedSequence(n: number): number[] {
        const size = n * 2;
        const path = new Array<number>(size).fill(0);
        const used = new Array<number>(size).fill(2);
        used[1] = 1;

        const place = (position: number): boolean => {
            if (position === size) return true;
            if (path[position] !== 0) return place(position + 1);
            for (let candidate = n; candidate >= 2; candidate -= 1) {
                if (used[candidate] > 0 && position + candidate < size && path[position + candidate] === 0) {
                    used[candidate] = 0;
                    path[position] = candidate;
                    path[position + candidate] = candidate;
                    if (place(position + 1)) return true;
                    path[position] = 0;
                    path[position + candidate] = 0;
                    used[candidate] = 2;
                }
            }
            if (used[1] > 0) {
                used[1] = 0;
                path[position] = 1;
                if (place(position + 1)) return true;
                path[position] = 0;
                used[1] = 1;
            }
            return false;
        };

        place(1);
        return path.slice(1);
    }
}
