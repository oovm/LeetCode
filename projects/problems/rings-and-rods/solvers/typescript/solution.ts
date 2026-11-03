export class Solution {
    countPoints(rings: string): number {
        const rods = new Array<number>(10).fill(0);
        for (let i = 0; i < rings.length; i += 2) {
            const bit = rings[i] === 'R' ? 1 : rings[i] === 'G' ? 2 : 4;
            rods[rings.charCodeAt(i + 1) - 48] |= bit;
        }
        return rods.filter((mask) => mask === 7).length;
    }
}
