export class Solution {
    carFleet(target: number, position: number[], speed: number[]): number {
        const cars = position.map((value, index) => [value, speed[index]] as [number, number]);
        cars.sort((a, b) => a[0] - b[0]);
        let fleets = 0;
        let previousNum = 0;
        let previousDen = 1;
        for (let cursor = cars.length - 1; cursor >= 0; cursor--) {
            const num = target - cars[cursor][0];
            const den = cars[cursor][1];
            if (num * previousDen > previousNum * den) {
                fleets++;
                previousNum = num;
                previousDen = den;
            }
        }
        return fleets;
    }
}
