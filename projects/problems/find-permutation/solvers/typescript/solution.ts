export class Solution {
    findPermutation(s: string): number[] {
        const n = s.length;
        const ans: number[] = [];
        for (let i = 0; i <= n; i++) {
            ans.push(i + 1);
        }
        let index = 0;
        while (index < n) {
            let stop = index;
            while (stop < n && s[stop] === "D") {
                stop += 1;
            }
            let left = index;
            let right = stop;
            while (left < right) {
                const temp = ans[left];
                ans[left] = ans[right];
                ans[right] = temp;
                left += 1;
                right -= 1;
            }
            index = Math.max(index + 1, stop);
        }
        return ans;
    }
}
