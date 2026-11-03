function punishable(sq: number, target: number): boolean {
    if (sq === target) {
        return true;
    }
    if (target < 0) {
        return false;
    }
    for (let place = 10; Math.floor(sq / (place / 10)) > 0; place *= 10) {
        if (punishable(Math.floor(sq / place), target - (sq % place))) {
            return true;
        }
    }
    return false;
}

export class Solution {
    punishmentNumber(n: number): number {
        let total = 0;
        for (let i = 1; i <= n; i++) {
            if (punishable(i * i, i)) {
                total += i * i;
            }
        }
        return total;
    }
}
