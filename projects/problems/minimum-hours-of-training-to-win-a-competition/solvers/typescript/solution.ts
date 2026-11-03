export class Solution {
    minNumberOfHours(
        initialEnergy: number,
        initialExperience: number,
        energy: number[],
        experience: number[],
    ): number {
        const totalEnergy = energy.reduce((a, b) => a + b, 0);
        let hours = Math.max(0, totalEnergy + 1 - initialEnergy);
        let current = initialExperience;
        for (const exp of experience) {
            if (current <= exp) {
                hours += exp + 1 - current;
                current = exp + 1;
            }
            current += exp;
        }
        return hours;
    }
}
