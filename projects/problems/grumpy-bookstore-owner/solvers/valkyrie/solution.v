namespace leetcode.grumpy_bookstore_owner;

# 原本不生气时段的顾客全部计入基数；再用定长滑窗找「抑制 minutes 分钟」带来的最大增量。
[export(case: "camelCase")]
micro maxSatisfied(customers: [i64], grumpy: [i64], minutes: i64) -> i64 {
    let mut base: i64 = 0
    let mut i: usize = 0
    while i < customers.length() {
        if grumpy⁅i⁆ == 0 {
            base = base + customers⁅i⁆
        }
        i = i + 1
    }

    let mut width: usize = minutes as usize
    if width > customers.length() {
        width = customers.length()
    }

    let mut extra: i64 = 0
    let mut j: usize = 0
    while j < width {
        if grumpy⁅j⁆ == 1 {
            extra = extra + customers⁅j⁆
        }
        j = j + 1
    }

    let mut best: i64 = extra
    let mut right: usize = width
    while right < customers.length() {
        if grumpy⁅right⁆ == 1 {
            extra = extra + customers⁅right⁆
        }
        if grumpy⁅right - width⁆ == 1 {
            extra = extra - customers⁅right - width⁆
        }
        if extra > best {
            best = extra
        }
        right = right + 1
    }
    return base + best
}

class Solution {
    micro maxSatisfied(self, customers: [i64], grumpy: [i64], minutes: i64): i64 {
        return maxSatisfied(customers, grumpy, minutes)
    }
}
