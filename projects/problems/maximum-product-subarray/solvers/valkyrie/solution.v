namespace leetcode.maximum_product_subarray;

# 同时滚动当前最大值与最小值，负数翻转时交换角色。
[export(case: "camelCase")]
micro max_product(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = nums⁅0⁆
    let mut hi: i64 = 1
    let mut lo: i64 = 1
    let mut loop_index_9: usize = 0
    while loop_index_9 < nums.length() {
        let x: i64 = nums⁅loop_index_9⁆
            let prod_hi: i64 = hi * x
            let prod_lo: i64 = lo * x
            let mut next_hi: i64 = prod_hi
            if prod_lo > next_hi {
                next_hi = prod_lo
            }
            if x > next_hi {
                next_hi = x
            }
            let mut next_lo: i64 = prod_hi
            if prod_lo < next_lo {
                next_lo = prod_lo
            }
            if x < next_lo {
                next_lo = x
            }
            hi = next_hi
            lo = next_lo
            if hi > best {
                best = hi
            }
        loop_index_9 = loop_index_9 + 1
    }
    return best
}

class Solution {
    micro maxProduct(self, nums: ArrayList<i64>): i64 {
        return max_product(nums)
    }
}
