export class Solution {
    beautifulArray(n: number): number[] {
        return this.build(n);
    }

    private build(size: number): number[] {
        if (size === 1) {
            return [1];
        }
        const left = this.build(Math.floor((size + 1) / 2));
        const right = this.build(Math.floor(size / 2));
        const out: number[] = [];
        for (const value of left) {
            out.push(value * 2 - 1);
        }
        for (const value of right) {
            out.push(value * 2);
        }
        return out;
    }
}
