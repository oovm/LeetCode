export class Solution {
    advantageCount(nums1: number[], nums2: number[]): number[] {
        const sortedA = [...nums1].sort((a, b) => a - b);
        const order = nums2.map((_, index) => index).sort((a, b) => nums2[a] - nums2[b]);
        const result = new Array<number>(nums1.length).fill(0);
        const used = new Array<boolean>(nums1.length).fill(false);
        const losers: number[] = [];

        let candidate = 0;
        for (const index of order) {
            const target = nums2[index];

            while (candidate < sortedA.length && used[candidate]) candidate += 1;
            while (candidate < sortedA.length && sortedA[candidate] <= target) candidate += 1;

            if (candidate < sortedA.length) {
                result[index] = sortedA[candidate];
                used[candidate] = true;
                candidate += 1;
            } else {
                losers.push(index);
            }
        }

        const leftovers: number[] = [];
        for (let i = 0; i < sortedA.length; i += 1) {
            if (!used[i]) leftovers.push(sortedA[i]);
        }

        for (let i = 0; i < losers.length; i += 1) {
            result[losers[losers.length - 1 - i]] = leftovers[i];
        }
        return result;
    }
}
