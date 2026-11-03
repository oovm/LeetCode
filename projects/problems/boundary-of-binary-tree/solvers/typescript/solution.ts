export class Solution {
    boundaryOfBinaryTree(root: (number | null)[]): number[] {
        const at = (i: number) => (i < root.length ? root[i] : null);
        const isLeaf = (i: number) => at(2 * i + 1) === null && at(2 * i + 2) === null;
        const left: number[] = [];
        for (let i = 1; at(i) !== null && !isLeaf(i); i = at(2 * i + 1) !== null ? 2 * i + 1 : 2 * i + 2) {
            left.push(at(i)!);
        }
        const leaves: number[] = [];
        const collect = (i: number) => {
            if (at(i) === null) return;
            if (isLeaf(i)) leaves.push(at(i)!);
            collect(2 * i + 1);
            collect(2 * i + 2);
        };
        collect(0);
        const right: number[] = [];
        for (let i = 2; at(i) !== null && !isLeaf(i); i = at(2 * i + 2) !== null ? 2 * i + 2 : 2 * i + 1) {
            right.push(at(i)!);
        }
        return [root[0]!, ...left, ...leaves, ...right.reverse()];
    }
}
