export class Solution {
    maxDistance(position: number[], m: number): number {
        const ordered = [...position].sort((a, b) => a - b);
        const placeable = (gap: number): boolean => {
            let placed = 1;
            let last = ordered[0];
            for (let i = 1; i < ordered.length; i++) {
                if (ordered[i] - last >= gap) {
                    placed += 1;
                    last = ordered[i];
                    if (placed >= m) return true;
                }
            }
            return placed >= m;
        };
        let low = 1;
        let high = ordered[ordered.length - 1] - ordered[0];
        if (m > 2) high = Math.floor(high / (m - 1));
        while (low < high) {
            const mid = low + Math.floor((high - low + 1) / 2);
            if (placeable(mid)) low = mid;
            else high = mid - 1;
        }
        return low;
    }
}
