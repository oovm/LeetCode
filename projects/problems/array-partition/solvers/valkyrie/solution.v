namespace leetcode.array_partition

# 升序后相邻两数成对，每组取较小者恰好是排序后的第 0、2、4... 个元素。
# 值域 [-10000, 30000] 有界，用计数表代替比较排序，时间 O(n + 值域)。
[export(case: "camelCase")]
micro arrayPairSum(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let zero: usize = 0
    let mut low: i64 = nums⁅zero⁆
    let mut high: i64 = nums⁅zero⁆
    let mut i: usize = 1
    while i < count {
        let value: i64 = nums⁅i⁆
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
        i = i + 1
    }

    let span: usize = (high - low + 1) as usize
    let mut buckets: ArrayList<i64> = ArrayList::new(span)
    let mut slot: usize = 0
    while slot < span {
        buckets.push(0)
        slot = slot + 1
    }

    let mut j: usize = 0
    while j < count {
        let offset: usize = (nums⁅j⁆ - low) as usize
        buckets⁅offset⁆ = buckets⁅offset⁆ + 1
        j = j + 1
    }

    let mut total: i64 = 0
    let mut taken: i64 = 0
    let mut offset: usize = 0
    while offset < span {
        let there: i64 = buckets⁅offset⁆
        let mut repeat: i64 = 0
        while repeat < there {
            if taken % 2 == 0 {
                total = total + (low + offset as i64)
            }
            taken = taken + 1
            repeat = repeat + 1
        }
        offset = offset + 1
    }
    return total
}

class Solution {
    micro arrayPairSum(self, nums: ArrayList<i64>): i64 {
        return arrayPairSum(nums)
    }
}
