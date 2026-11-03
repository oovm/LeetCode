export class Solution {
    mergeTwoLists(list1: number[], list2: number[]): number[] {
        const out: number[] = [];
        let i = 0;
        let j = 0;
        while (i < list1.length || j < list2.length) {
            if (j >= list2.length || (i < list1.length && list1[i] <= list2[j])) {
                out.push(list1[i]);
                i += 1;
            } else {
                out.push(list2[j]);
                j += 1;
            }
        }
        return out;
    }
}
