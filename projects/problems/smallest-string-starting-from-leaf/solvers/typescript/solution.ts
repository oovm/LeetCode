export class Solution {
    smallestFromLeaf(root: number[]): string {
        let best = '{';
        const walk = (index: number, path: number[]) => {
            if (index >= root.length) {
                return;
            }
            path.push(root[index]);
            let leaf = true;
            if (index * 2 + 1 < root.length) {
                leaf = false;
                walk(index * 2 + 1, path);
            }
            if (index * 2 + 2 < root.length) {
                leaf = false;
                walk(index * 2 + 2, path);
            }
            if (leaf) {
                let candidate = '';
                for (let cursor = path.length - 1; cursor >= 0; cursor--) {
                    candidate += String.fromCharCode(97 + path[cursor]);
                }
                if (candidate < best) {
                    best = candidate;
                }
            }
            path.pop();
        };
        walk(0, []);
        return best;
    }
}
