export class Solution {
    maximumTastiness(price: number[], k: number): number {
        const ordered = [...price].sort((a, b) => a - b);
        const pickable = (gap: number): boolean => {
            let taken = 1;
            let last = ordered[0];
            for (let i = 1; i < ordered.length; i++) {
                if (ordered[i] - last >= gap) {
                    taken += 1;
                    last = ordered[i];
                    if (taken >= k) return true;
                }
            }
            return taken >= k;
        };
        let low = 0;
        let high = ordered[ordered.length - 1] - ordered[0];
        while (low < high) {
            const mid = low + Math.floor((high - low + 1) / 2);
            if (pickable(mid)) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
