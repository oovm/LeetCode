namespace leetcode.path_sum_iv;

using std.collection;

# 每个编码 d p v 表示深度 d、位置 p、值 v。把 深度+位置 映射到值，
# 再从根 11 做一次先序 DFS，只在叶子处累加整条路径和，O(节点数)。
micro walk(node: i64, carried: i64, values: HashMap<i64, i64>, answer: ArrayList<i64>) -> unit {
    if !values.contains_key(node) {
        return
    }
    let sum: i64 = carried + values.get(node).unwrap()
    let depth: i64 = node / 10
    let position: i64 = node % 10
    let left: i64 = (depth + 1) * 10 + position * 2 - 1
    let right: i64 = left + 1
    if !values.contains_key(left) && !values.contains_key(right) {
        answer⁅0⁆ = answer⁅0⁆ + sum
        return
    }
    walk(left, sum, values, answer)
    walk(right, sum, values, answer)
}

[export(case: "camelCase")]
micro path_sum(nums: ArrayList<i64>) -> i64 {
    let mut values: HashMap<i64, i64> = HashMap::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        let encoded: i64 = nums⁅index⁆
        values.insert(encoded / 10, encoded % 10)
        index = index + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(1)
    answer.push(0)
    walk(11, 0, values, answer)
    return answer⁅0⁆
}

class Solution {
    micro pathSum(self, nums: ArrayList<i64>): i64 {
        return path_sum(nums)
    }
}
