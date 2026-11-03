export class Solution {
    maximumUnits(boxTypes: number[][], truckSize: number): number {
        const sorted = [...boxTypes].sort((a, b) => b[1] - a[1]);
        let units = 0;
        let left = truckSize;
        for (const [boxes, per] of sorted) {
            const take = Math.min(boxes, left);
            units += take * per;
            left -= take;
            if (left === 0) break;
        }
        return units;
    }
}
