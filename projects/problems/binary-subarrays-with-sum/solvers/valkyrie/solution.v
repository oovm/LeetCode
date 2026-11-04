namespace leetcode.binary_subarrays_with_sum;

using std.collection;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 前缀和 + 频次表：每个前缀 `prefix` 累加此前出现过的 `prefix - goal` 次数。
[export(case: "camelCase")]
micro numSubarraysWithSum(nums: ArrayList<i64>, goal: i64) -> i64 {
    let mut counts: HashMap<i64, i64> = HashMap::new(nums.length() + 1)
    counts.insert(0, 1)

    let mut prefix: i64 = 0
    let mut total: i64 = 0
    let mut loop_index_13: usize = 0
    while loop_index_13 < nums.length() {
        let value: i64 = nums⁅loop_index_13⁆
            prefix = prefix + value

            let target: i64 = prefix - goal
            if counts.contains_key(target) {
                total = total + counts.get(target).unwrap()
            }

            let mut next: i64 = 1
            if counts.contains_key(prefix) {
                next = counts.get(prefix).unwrap() + 1
            }
            counts.insert(prefix, next)
        loop_index_13 = loop_index_13 + 1
    }
    return total
}

class Solution {
    micro numSubarraysWithSum(self, nums: ArrayList<i64>, goal: i64): i64 {
        return numSubarraysWithSum(nums, goal)
    }
}
