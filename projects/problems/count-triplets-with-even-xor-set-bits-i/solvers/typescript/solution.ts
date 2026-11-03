export class Solution {
    tripletCount(a: number[], b: number[], c: number[]): number {
        const parity = (arr: number[]) => {
            let even = 0;
            let odd = 0;
            for (const x of arr) {
                let p = 0;
                for (let v = x; v > 0; v >>= 1) p ^= v & 1;
                p === 0 ? even++ : odd++;
            }
            return [even, odd];
        };
        const [ae, ao] = parity(a);
        const [be, bo] = parity(b);
        const [ce, co] = parity(c);
        return ae * be * ce + ae * bo * co + ao * be * co + ao * bo * ce;
    }
}
