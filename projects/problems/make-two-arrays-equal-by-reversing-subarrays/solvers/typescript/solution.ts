export class Solution {
    canBeEqual(target: number[], arr: number[]): boolean {
        const count = new Map<number, number>();
        for (const v of target) count.set(v, (count.get(v) ?? 0) + 1);
        for (const v of arr) {
            const c = count.get(v) ?? 0;
            if (c === 0) return false;
            count.set(v, c - 1);
        }
        return true;
    }
}
