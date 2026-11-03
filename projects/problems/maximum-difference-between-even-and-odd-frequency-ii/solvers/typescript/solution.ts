export class Solution {
    maxDifference(s: string, k: number): number {
        let best = -Infinity;
        const digits = [...s].map((c) => c.charCodeAt(0) - 48);
        for (let a = 0; a < 5; a++) {
            for (let b = 0; b < 5; b++) {
                if (a === b) continue;
                let pa = 0;
                let pb = 0;
                const table = [
                    [Infinity, Infinity],
                    [Infinity, Infinity],
                ];
                let left = 0;
                for (let right = 0; right < s.length; right++) {
                    if (digits[right] === a) pa += 1;
                    if (digits[right] === b) pb += 1;
                    while (right - left + 1 > k && pb > 0 && pa > 0) {
                        const keyA = pa % 2;
                        const keyB = pb % 2;
                        if (pa - (digits[left] === a ? 1 : 0) > 0 && pb - (digits[left] === b ? 1 : 0) > 0) {
                            table[keyA][keyB] = Math.min(table[keyA][keyB], pa - pb);
                            if (digits[left] === a) pa -= 1;
                            if (digits[left] === b) pb -= 1;
                            left += 1;
                        } else {
                            break;
                        }
                    }
                    if (pa > 0 && pb > 0 && right - left + 1 >= k) {
                        const need = table[1 - (pa % 2)][pb % 2];
                        if (need !== Infinity) {
                            best = Math.max(best, pa - pb - need);
                        }
                    }
                }
            }
        }
        return best === -Infinity ? -1 : best;
    }
}
