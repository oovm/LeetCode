namespace leetcode.maximum_product_of_three_numbers

# 乘积最大只来自两种组合：最大的三个数，或最小两个负数乘最大一个数。
# 单次扫描维护 top3 与 low2，时间 O(n)。
[export(case: "camelCase")]
micro maximumProduct(nums: ArrayList<i64>) -> i64 {
    let mut top1: i64 = -1000000000000
    let mut top2: i64 = -1000000000000
    let mut top3: i64 = -1000000000000
    let mut low1: i64 = 1000000000000
    let mut low2: i64 = 1000000000000
    let count: usize = nums.length()
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        let mut placed: bool = false
        if value > top1 {
            top3 = top2
            top2 = top1
            top1 = value
            placed = true
        }
        if placed == false {
            if value > top2 {
                top3 = top2
                top2 = value
                placed = true
            }
        }
        if placed == false {
            if value > top3 {
                top3 = value
                placed = true
            }
        }
        let mut lowered: bool = false
        if value < low1 {
            low2 = low1
            low1 = value
            lowered = true
        }
        if lowered == false {
            if value < low2 {
                low2 = value
            }
        }
        i = i + 1
    }
    let first: i64 = top1 * top2 * top3
    let second: i64 = low1 * low2 * top1
    if second > first {
        return second
    }
    return first
}

class Solution {
    micro maximumProduct(self, nums: ArrayList<i64>): i64 {
        return maximumProduct(nums)
    }
}
