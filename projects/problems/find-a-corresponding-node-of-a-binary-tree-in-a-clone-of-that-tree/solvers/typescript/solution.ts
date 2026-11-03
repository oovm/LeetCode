export class Solution {
    getTargetCopy(
        original: (number | null)[],
        cloned: (number | null)[],
        target: number
    ): number {
        let index = -1;
        const walk = (i: number): void => {
            if (i >= original.length || original[i] === null) return;
            if (original[i] === target) {
                index = i;
                return;
            }
            walk(2 * i + 1);
            walk(2 * i + 2);
        };
        walk(0);
        return index;
    }
}
