export class Solution {
    accountBalanceAfterPurchase(purchaseAmount: number): number {
        const rounded = Math.round(purchaseAmount / 10) * 10;
        return 100 - rounded;
    }
}
