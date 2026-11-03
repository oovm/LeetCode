function digitProduct(x: number): number {
    let product = 1;
    for (const ch of String(x)) {
        product *= Number(ch);
    }
    return product;
}

export class Solution {
    smallestNumber(n: number, t: number): number {
        let x = n;
        while (digitProduct(x) % t !== 0) {
            x += 1;
        }
        return x;
    }
}
