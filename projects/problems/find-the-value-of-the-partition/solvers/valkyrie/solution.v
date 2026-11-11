namespace leetcode.find_the_value_of_the_partition;

# 划分后左半最大与右半最小之差的最小值，等于升序相邻元素差的最小值。
[export(case: "camelCase")]
micro findValueOfPartition(nums: [i64]) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    if ordered.length() < 2 {
        return 0
    }

    let mut best: i64 = ordered⁅1⁆ - ordered⁅0⁆
    let mut i: usize = 2
    while i < ordered.length() {
        let gap: i64 = ordered⁅i⁆ - ordered⁅i - 1⁆
        if gap < best {
            best = gap
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro findValueOfPartition(self, nums: [i64]): i64 {
        return findValueOfPartition(nums)
    }
}
