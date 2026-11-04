export class Solution {
    findRestaurant(list1: string[], list2: string[]): string[] {
        const indexOfSecond = new Map<string, number>();
        for (let j = 0; j < list2.length; j++) indexOfSecond.set(list2[j], j);
        let best = Infinity;
        for (let i = 0; i < list1.length; i++) {
            const j = indexOfSecond.get(list1[i]);
            if (j !== undefined) best = Math.min(best, i + j);
        }
        const out: string[] = [];
        for (let i = 0; i < list1.length; i++) {
            const j = indexOfSecond.get(list1[i]);
            if (j !== undefined && i + j === best) out.push(list1[i]);
        }
        return out;
    }
}
