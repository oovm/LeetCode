export class Solution {
    getStrongest(arr: number[], k: number): number[] {
        const values = [...arr].sort((a, b) => a - b);
        const median = values[(values.length - 1) >> 1];
        const ordered = [...values].sort((a, b) => {
            const distanceA = Math.abs(a - median);
            const distanceB = Math.abs(b - median);
            if (distanceA !== distanceB) return distanceB - distanceA;
            return b - a;
        });
        return ordered.slice(0, k);
    }
}
