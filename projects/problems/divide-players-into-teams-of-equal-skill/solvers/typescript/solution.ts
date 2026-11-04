export class Solution {
    dividePlayers(skill: number[]): number {
        const values = [...skill].sort((a, b) => a - b);
        const total = skill.reduce((sum, value) => sum + value, 0);
        const teams = skill.length / 2;
        if (total % teams !== 0) return -1;
        const target = total / teams;
        let left = 0;
        let right = values.length - 1;
        let chemistry = 0;
        while (left < right) {
            if (values[left] + values[right] !== target) return -1;
            chemistry += values[left] * values[right];
            left += 1;
            right -= 1;
        }
        return chemistry;
    }
}
