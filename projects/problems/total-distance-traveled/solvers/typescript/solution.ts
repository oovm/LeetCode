export class Solution {
    distanceTraveled(mainTank: number, additionalTank: number): number {
        let main = mainTank;
        let extra = additionalTank;
        let used = 0;
        let distance = 0;
        while (main > 0) {
            main -= 1;
            used += 1;
            distance += 10;
            if (used === 5) {
                used = 0;
                if (extra > 0) {
                    extra -= 1;
                    main += 1;
                }
            }
        }
        return distance;
    }
}
