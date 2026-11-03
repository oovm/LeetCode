export class Solution {
    kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
        const result: number[][] = [];
        const used = new Set<string>();
        // 简单堆：[sum, i, j]
        const heap: [number, number, number][] = [];
        const push = (i: number, j: number) => {
            if (i < nums1.length && j < nums2.length && !used.has(`${i},${j}`)) {
                used.add(`${i},${j}`);
                heap.push([nums1[i] + nums2[j], i, j]);
                for (let p = heap.length - 1; p > 0; ) {
                    const parent = (p - 1) >> 1;
                    if (heap[parent][0] <= heap[p][0]) break;
                    [heap[parent], heap[p]] = [heap[p], heap[parent]];
                    p = parent;
                }
            }
        };
        push(0, 0);
        while (result.length < k && heap.length > 0) {
            let [sum, i, j] = heap[0];
            heap[0] = heap[heap.length - 1];
            heap.pop();
            for (let p = 0; ; ) {
                const l = 2 * p + 1;
                const r = 2 * p + 2;
                let smallest = p;
                if (l < heap.length && heap[l][0] < heap[smallest][0]) smallest = l;
                if (r < heap.length && heap[r][0] < heap[smallest][0]) smallest = r;
                if (smallest === p) break;
                [heap[smallest], heap[p]] = [heap[p], heap[smallest]];
                p = smallest;
            }
            result.push([nums1[i], nums2[j]]);
            push(i + 1, j);
            push(i, j + 1);
        }
        return result;
    }
}
