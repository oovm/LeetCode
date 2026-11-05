export class Solution {
    shoppingOffers(price: number[], special: number[][], needs: number[]): number {
        const bits = 4;
        const base = 16;
        const weight = (index: number): number => base ** index;
        const memo = new Map<number, number>();
        const spend = (state: number): number => {
            const cached = memo.get(state);
            if (cached !== undefined) {
                return cached;
            }
            let best = 0;
            for (let item = 0; item < price.length; item++) {
                best += price[item] * (Math.floor(state / weight(item)) % base);
            }
            for (const offer of special) {
                let next = state;
                let fits = true;
                for (let item = 0; item < needs.length; item++) {
                    if (Math.floor(state / weight(item)) % base < offer[item]) {
                        fits = false;
                        break;
                    }
                    next -= offer[item] * weight(item);
                }
                if (fits) {
                    best = Math.min(best, offer[offer.length - 1] + spend(next));
                }
            }
            memo.set(state, best);
            return best;
        };
        let state = 0;
        needs.forEach((need, index) => {
            state += need * weight(index);
        });
        return spend(state);
    }
}
