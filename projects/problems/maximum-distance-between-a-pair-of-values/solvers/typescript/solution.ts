export class Solution {
    maxDistance(nums1: number[], nums2: number[]): number {
        const n1 = nums1.length;
        if (n1 === 0 || nums2.length === 0) return 0;
        const prefixMin = new Array<number>(n1).fill(0);
        let running = nums1[0];
        for (let i = 0; i < n1; i++) {
            running = Math.min(running, nums1[i]);
            prefixMin[i] = running;
        }
        let best = 0;
        for (let right = 0; right < nums2.length; right++) {
            const limit = Math.min(right, n1 - 1);
            const target = nums2[right];
            if (prefixMin[limit] > target) continue;
            let low = 0;
            let high = limit;
            while (low < high) {
                const mid = low + Math.floor((high - low) / 2);
                if (prefixMin[mid] <= target) high = mid;
                else low = mid + 1;
            }
            best = Math.max(best, right - low);
        }
        return best;
    }
}
