export class Solution {
    tree2str(root: number[]): string {
        const render = (index: number): string => {
            if (index >= root.length) {
                return "";
            }
            const value = root[index];
            const left = render(index * 2 + 1);
            const right = render(index * 2 + 2);
            if (left.length === 0 && right.length === 0) {
                return String(value);
            }
            if (right.length === 0) {
                return `${value}(${left})`;
            }
            return `${value}(${left})(${right})`;
        };
        return render(0);
    }
}
