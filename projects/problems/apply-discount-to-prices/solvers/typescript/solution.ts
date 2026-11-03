export class Solution {
    discountPrices(discount: number, sentence: string): string {
        return sentence
            .split(' ')
            .map((word) => {
                if (/^\$\d+$/.test(word)) {
                    const price = Number(word.slice(1));
                    return `$${((price * (100 - discount)) / 100).toFixed(2)}`;
                }
                return word;
            })
            .join(' ');
    }
}
