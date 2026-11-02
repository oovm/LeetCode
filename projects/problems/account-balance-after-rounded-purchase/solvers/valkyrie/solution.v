namespace leetcode.account_balance_after_rounded_purchase;

[export(case: "camelCase")]
micro account_balance_after_purchase(purchaseAmount: i64) -> i64 {
    let rounded: i64 = ((purchaseAmount + 5) / 10) * 10
    return 100 - rounded
}

class Solution {
    micro accountBalanceAfterPurchase(self, purchaseAmount: i64): i64 {
        return account_balance_after_purchase(purchaseAmount)
    }
}
