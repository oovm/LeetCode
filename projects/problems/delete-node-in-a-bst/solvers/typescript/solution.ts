export class Solution {
    deleteNode(root: (number | null)[], key: number): (number | null)[] {
        interface Node {
            val: number;
            left: Node | null;
            right: Node | null;
        }
        const build = (i: number): Node | null => {
            if (i >= root.length || root[i] === null) return null;
            return { val: root[i]!, left: build(2 * i + 1), right: build(2 * i + 2) };
        };
        const remove = (node: Node | null, k: number): Node | null => {
            if (!node) return null;
            if (k < node.val) node.left = remove(node.left, k);
            else if (k > node.val) node.right = remove(node.right, k);
            else {
                if (!node.left) return node.right;
                if (!node.right) return node.left;
                let succ = node.right;
                while (succ.left) succ = succ.left;
                node.val = succ.val;
                node.right = remove(node.right, succ.val);
            }
            return node;
        };
        const out: (number | null)[] = [];
        const emit = (node: Node | null, i: number) => {
            if (!node) return;
            out[i] = node.val;
            emit(node.left, 2 * i + 1);
            emit(node.right, 2 * i + 2);
        };
        emit(remove(build(0), key), 0);
        while (out.length > 0 && out[out.length - 1] == null) out.pop();
        return out.map((v) => v ?? null);
    }
}
