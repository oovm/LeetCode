export class Solution {
    numComponents(head: number[], nums: number[]): number {
        const present = new Set(nums);
        let components = 0;
        let inside = false;
        for (const value of head) {
            if (present.has(value)) {
                if (!inside) {
                    components += 1;
                }
                inside = true;
            } else {
                inside = false;
            }
        }
        return components;
    }
}
