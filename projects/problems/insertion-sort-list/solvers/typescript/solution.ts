export class Solution {
    insertionSortList(head: number[]): number[] {
        const result: number[] = [];
        for (const x of head) {
            let i = result.length;
            while (i > 0 && result[i - 1] > x) i--;
            result.splice(i, 0, x);
        }
        return result;
    }
}
