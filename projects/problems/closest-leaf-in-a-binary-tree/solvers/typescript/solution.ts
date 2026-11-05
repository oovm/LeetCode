export class Solution {
    findClosestLeaf(root: number[], k: number): number {
        const total = root.length;
        let start = -1;
        for (let index = 0; index < total; index++) {
            if (root[index] === k) {
                start = index;
                break;
            }
        }
        if (start < 0) {
            return k;
        }
        const visited = new Array<boolean>(total).fill(false);
        const queue: number[] = [start];
        visited[start] = true;
        let head = 0;
        while (head < queue.length) {
            const node = queue[head++];
            const left = node * 2 + 1;
            const right = left + 1;
            if (left >= total) {
                return root[node];
            }
            if (node > 0) {
                const parent = Math.floor((node - 1) / 2);
                if (!visited[parent]) {
                    visited[parent] = true;
                    queue.push(parent);
                }
            }
            if (!visited[left]) {
                visited[left] = true;
                queue.push(left);
            }
            if (right < total && !visited[right]) {
                visited[right] = true;
                queue.push(right);
            }
        }
        return k;
    }
}
