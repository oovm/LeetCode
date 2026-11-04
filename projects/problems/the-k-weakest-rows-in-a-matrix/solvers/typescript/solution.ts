export class Solution {
    kWeakestRows(mat: number[][], k: number): number[] {
        // 与 Python 参考解的 n - bisect_right(row[::-1], 0) 逐语义对齐，随后按行号稳定升序。
        const bisectRight = (values: number[], target: number): number => {
            let low = 0;
            let high = values.length;
            while (low < high) {
                const middle = (low + high) >> 1;
                if (target < values[middle]) {
                    high = middle;
                } else {
                    low = middle + 1;
                }
            }
            return low;
        };
        const strength = mat.map((row) => row.length - bisectRight([...row].reverse(), 0));
        return Array.from({ length: mat.length }, (_, index) => index)
            .sort((a, b) => strength[a] - strength[b] || a - b)
            .slice(0, k);
    }
}
