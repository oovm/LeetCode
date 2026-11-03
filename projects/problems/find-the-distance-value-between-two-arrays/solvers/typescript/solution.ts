export class Solution {
    findTheDistanceValue(arr1: number[], arr2: number[], d: number): number {
        let count = 0;
        for (const a of arr1) {
            let ok = true;
            for (const b of arr2) {
                if (Math.abs(a - b) <= d) {
                    ok = false;
                    break;
                }
            }
            if (ok) count++;
        }
        return count;
    }
}
