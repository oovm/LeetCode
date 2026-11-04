namespace leetcode.maximum_tastiness_of_candy_basket;

using std.collection;

# 先按价格升序，再二分答案：最小间隔 `gap` 单调可行。
# 可行性用贪心取第一个满足间隔的价格。
micro pickable(price: ArrayList<i64>, gap: i64, k: i64) -> bool {
    let mut taken: i64 = 1
    let mut last: i64 = price⁅0⁆
    let mut index: usize = 1
    while index < price.length() {
        if price⁅index⁆ - last >= gap {
            taken = taken + 1
            last = price⁅index⁆
            if taken >= k {
                return true
            }
        }
        index = index + 1
    }
    return taken >= k
}

[export(case: "camelCase")]
micro maximumTastiness(price: ArrayList<i64>, k: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(price.length())
    loop value in price {
        ordered.push(value)
    }
    sort(ordered)

    let mut low: i64 = 0
    let mut high: i64 = ordered⁅ordered.length() - 1⁆ - ordered⁅0⁆
    while low < high {
        let mid: i64 = low + (high - low + 1) / 2
        if pickable(ordered, mid, k) {
            low = mid
        } else {
            high = mid - 1
        }
    }
    return low
}

class Solution {
    micro maximumTastiness(self, price: ArrayList<i64>, k: i64): i64 {
        return maximumTastiness(price, k)
    }
}
