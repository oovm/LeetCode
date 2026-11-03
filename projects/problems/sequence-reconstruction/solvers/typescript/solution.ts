export class Solution {
    sequenceReconstruction(nums: number[], sequences: number[][]): boolean {
        const n = nums.length;
        const pos = new Map(nums.map((v, i) => [v, i]));
        const seen = new Set<number>();
        for (const seq of sequences) {
            for (let i = 0; i + 1 < seq.length; i++) {
                if (pos.get(seq[i])! >= pos.get(seq[i + 1])!) return false;
                seen.add(pos.get(seq[i])!);
            }
        }
        for (let i = 0; i + 1 < n; i++) {
            if (!seen.has(i)) return false;
        }
        return true;
    }
}
