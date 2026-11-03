export class Solution {
    deleteDuplicates(head: number[]): number[] {
        const result: number[] = [];
        let i = 0;
        while (i < head.length) {
            let j = i;
            while (j + 1 < head.length && head[j + 1] === head[i]) j++;
            if (i === j) result.push(head[i]);
            i = j + 1;
        }
        return result;
    }
}
