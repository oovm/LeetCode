namespace leetcode.solution

using std.collection

# 题内触发点: G26 —— 对 `ArrayList<i64>` 直接调用单参排序，依赖 `i64: Comparable`（提案）与
# `where T: Comparable` 的排序入口；不传 `micro(a, b) -> i32`，也不编码排序键。
# 依赖 std C4（待落地 API）：`micro sort<T, C>(list: mut C) where C: Cardinal<Element = T> & Countable, T: Comparable`
# 该入口尚未落地，`sort` / `sorted` 不是现成能力；本处按定稿签名书写，C4 落地前不计通过。
micro order_items<T>(items: ArrayList<T>): unit
    where T: Equal & Comparable
{
    sort(items)
}

class Solution {
    [export(case: "camelCase")]
    micro maxCoins(piles: ArrayList<i64>) -> i64 {
        order_items(piles)

        # 升序后从末尾隔一个取一个：n-1、n-3、……，共 n / 3 次。
        let picks: usize = piles.length() / 3
        let mut taken: usize = 0
        let mut index: usize = piles.length() - 1
        let mut total: i64 = 0
        while taken < picks {
            total = total + piles⁅index⁆
            index = index - 2
            taken = taken + 1
        }
        return total
    }
}
