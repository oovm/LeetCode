export class Solution {
    xorQueries(arr: number[], queries: number[][]): number[] {
        const prefix: number[] = [0];
        for (const value of arr) {
            prefix.push(prefix[prefix.length - 1] ^ value);
        }
        const ans: number[] = [];
        for (const [left, right] of queries) {
            ans.push(prefix[right + 1] ^ prefix[left]);
        }
        return ans;
    }
}
