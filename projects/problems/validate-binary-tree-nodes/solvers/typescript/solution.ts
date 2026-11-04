export class Solution {
    validateBinaryTreeNodes(n: number, leftChild: number[], rightChild: number[]): boolean {
        // 统计入度：树中除根外每个节点入度恰为 1，所以入度 0 的节点必须唯一。
        const indegree = new Array<number>(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (const child of [leftChild[i], rightChild[i]]) {
                if (child === -1) continue;
                if (child < 0 || child >= n) return false;
                indegree[child]++;
                if (indegree[child] > 1) return false;
            }
        }

        let root = -1;
        for (let i = 0; i < n; i++) {
            if (indegree[i] === 0) {
                if (root !== -1) return false;
                root = i;
            }
        }
        if (root === -1) return false;

        // 从根出发显式栈遍历：重复访问说明有环或某节点有两个父亲。
        const visited = new Array<boolean>(n).fill(false);
        const stack = [root];
        let seen = 0;
        while (stack.length > 0) {
            const node = stack.pop()!;
            if (visited[node]) return false;
            visited[node] = true;
            seen++;
            if (leftChild[node] !== -1) stack.push(leftChild[node]);
            if (rightChild[node] !== -1) stack.push(rightChild[node]);
        }
        return seen === n;
    }
}
