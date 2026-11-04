export class Solution {
    totalFruit(fruits: number[]): number {
        const counts = new Map<number, number>();
        let left = 0;
        let best = 0;
        for (let right = 0; right < fruits.length; right += 1) {
            counts.set(fruits[right], (counts.get(fruits[right]) ?? 0) + 1);
            while (counts.size > 2) {
                const rest = counts.get(fruits[left])! - 1;
                if (rest === 0) counts.delete(fruits[left]);
                else counts.set(fruits[left], rest);
                left += 1;
            }
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}
