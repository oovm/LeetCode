export class Solution {
    maximumEnergy(energy: number[], k: number): number {
        const suffix = new Array<number>(energy.length).fill(0);
        for (let index = energy.length - 1; index >= 0; index--) {
            suffix[index] = energy[index] + (index + k < energy.length ? suffix[index + k] : 0);
        }
        let best = suffix[0];
        for (let i = 1; i < suffix.length; i++) best = Math.max(best, suffix[i]);
        return best;
    }
}
