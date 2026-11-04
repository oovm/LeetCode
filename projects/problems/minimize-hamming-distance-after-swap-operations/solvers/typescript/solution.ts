export class Solution {
    minimumHammingDistance(source: number[], target: number[], allowedSwaps: number[][]): number {
        const n = source.length;

        // 下标并查集：可交换的下标属于同一分量，分量内元素可任意重排。
        const parent = new Array<number>(n).fill(0).map((_, index) => index);
        const find = (value: number): number => {
            let root = value;
            while (parent[root] !== root) root = parent[root];
            let cursor = value;
            while (parent[cursor] !== root) {
                const next = parent[cursor];
                parent[cursor] = root;
                cursor = next;
            }
            return root;
        };
        for (const [left, right] of allowedSwaps) {
            const leftRoot = find(left);
            const rightRoot = find(right);
            if (leftRoot !== rightRoot) parent[leftRoot] = rightRoot;
        }

        // 按分量分组后比较 source 与 target 的多重集合，缺席数量即该分量的汉明距离。
        const counts = new Array<Map<number, number>>(n);
        for (let i = 0; i < n; i++) counts[i] = new Map<number, number>();
        for (let i = 0; i < n; i++) {
            const group = counts[find(i)];
            group.set(source[i], (group.get(source[i]) ?? 0) + 1);
        }

        let answer = 0;
        for (let i = 0; i < n; i++) {
            const group = counts[find(i)];
            const remaining = (group.get(target[i]) ?? 0) - 1;
            group.set(target[i], remaining);
            if (remaining < 0) answer++;
        }
        return answer;
    }
}
