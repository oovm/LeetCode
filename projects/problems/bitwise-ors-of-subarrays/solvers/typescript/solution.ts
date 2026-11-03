export class Solution {
    subarrayBitwiseORs(arr: number[]): number {
        let current = new Set<number>();
        const all = new Set<number>();
        for (const x of arr) {
            const next = new Set<number>([x]);
            all.add(x);
            for (const v of current) {
                const combined = v | x;
                next.add(combined);
                all.add(combined);
            }
            current = next;
        }
        return all.size;
    }
}
