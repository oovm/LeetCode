namespace leetcode.number_of_ways_to_split_array;

using std.collection;

# 前缀和：扫描到倒数第二个位置，前缀和大于等于剩余部分即构成一次合法切分。
[export(case: "camelCase")]
micro waysToSplitArray(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    loop value in nums {
        total = total + value
    }

    let mut prefix: i64 = 0
    let mut ways: i64 = 0
    let mut index: usize = 0
    while index + 1 < nums.length() {
        prefix = prefix + nums⁅index⁆
        if prefix >= total - prefix {
            ways = ways + 1
        }
        index = index + 1
    }
    return ways
}

class Solution {
    micro waysToSplitArray(self, nums: ArrayList<i64>): i64 {
        return waysToSplitArray(nums)
    }
}
