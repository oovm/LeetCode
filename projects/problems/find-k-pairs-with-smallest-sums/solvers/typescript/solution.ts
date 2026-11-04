export class Solution {
    kSmallestPairs(nums1: number[], nums2: number[], k: number): number[][] {
        const heap: [number, number, number][] = [];
        // 与 Python heapq 一致：按 (sum, i, j) 字典序取最小。
        const less = (a: [number, number, number], b: [number, number, number]): boolean => {
            if (a[0] !== b[0]) return a[0] < b[0];
            if (a[1] !== b[1]) return a[1] < b[1];
            return a[2] < b[2];
        };
        const push = (item: [number, number, number]): void => {
            heap.push(item);
            let p = heap.length - 1;
            while (p > 0) {
                const parent = (p - 1) >> 1;
                if (!less(heap[p], heap[parent])) break;
                [heap[parent], heap[p]] = [heap[p], heap[parent]];
                p = parent;
            }
        };
        const pop = (): [number, number, number] => {
            const top = heap[0];
            const last = heap.pop() as [number, number, number];
            if (heap.length > 0) {
                heap[0] = last;
                let p = 0;
                for (;;) {
                    const l = 2 * p + 1;
                    const r = 2 * p + 2;
                    let smallest = p;
                    if (l < heap.length && less(heap[l], heap[smallest])) smallest = l;
                    if (r < heap.length && less(heap[r], heap[smallest])) smallest = r;
                    if (smallest === p) break;
                    [heap[smallest], heap[p]] = [heap[p], heap[smallest]];
                    p = smallest;
                }
            }
            return top;
        };

        // 把 nums2 的每一行按列并入：每行只推入当前队首列。
        const limit = Math.min(k, nums1.length);
        for (let i = 0; i < limit; i++) push([nums1[i] + nums2[0], i, 0]);

        const result: number[][] = [];
        let remaining = k;
        while (remaining > 0 && heap.length > 0) {
            const [, i, j] = pop();
            result.push([nums1[i], nums2[j]]);
            remaining -= 1;
            if (j + 1 < nums2.length) push([nums1[i] + nums2[j + 1], i, j + 1]);
        }
        return result;
    }
}
