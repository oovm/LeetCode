export class Solution {
    upsideDownBinaryTree(root: (number | null)[]): (number | null)[] {
        interface Node {
            val: number;
            left: Node | null;
            right: Node | null;
        }
        const build = (i: number): Node | null => {
            if (i >= root.length || root[i] === null) return null;
            return { val: root[i]!, left: build(2 * i + 1), right: build(2 * i + 2) };
        };
        const flip = (node: Node | null): Node | null => {
            if (!node || !node.left) return node;
            const newRoot = flip(node.left);
            node.left.left = node.right;
            node.left.right = node;
            node.left = null;
            node.right = null;
            return newRoot;
        };
        const out: (number | null)[] = [];
        const emit = (node: Node | null, i: number) => {
            if (!node) return;
            out[i] = node.val;
            emit(node.left, 2 * i + 1);
            emit(node.right, 2 * i + 2);
        };
        emit(flip(build(0)), 0);
        while (out.length > 0 && out[out.length - 1] == null) out.pop();
        return out.map((v) => v ?? null);
    }
}
