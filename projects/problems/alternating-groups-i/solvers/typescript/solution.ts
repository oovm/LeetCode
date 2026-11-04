export class Solution {
    numberOfAlternatingGroups(colors: number[]): number {
        const count = colors.length;
        if (count < 3) {
            return 0;
        }
        let groups = 0;
        for (let index = 0; index < count; index++) {
            const first = colors[index];
            const second = colors[(index + 1) % count];
            const third = colors[(index + 2) % count];
            if (first !== second && second !== third) {
                groups++;
            }
        }
        return groups;
    }
}
