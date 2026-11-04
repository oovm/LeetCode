namespace leetcode.number_of_ways_to_split_array;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 前缀和：扫描到倒数第二个位置，前缀和大于等于剩余部分即构成一次合法切分。
[export(case: "camelCase")]
micro waysToSplitArray(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < nums.length() {
        let value: i64 = nums⁅loop_index_9⁆
            total = total + value
        loop_index_9 = loop_index_9 + 1
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
