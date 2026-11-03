export class Solution {
    relativeSortArray(arr1: number[], arr2: number[]): number[] {
        const rank = new Map<number, number>();
        arr2.forEach((v, i) => rank.set(v, i));
        return [...arr1].sort((a, b) => {
            const ra = rank.has(a) ? rank.get(a)! : 1000 + a;
            const rb = rank.has(b) ? rank.get(b)! : 1000 + b;
            return ra - rb;
        });
    }
}
