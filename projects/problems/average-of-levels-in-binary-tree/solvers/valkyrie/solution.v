namespace leetcode.average_of_levels_in_binary_tree;

using std.collection;

# 堆式下标递归：按层累计和与个数，逐层输出均值。
# 题内触发点: averageOfLevels 返回 `ArrayList<f64>`（非整数均值）。`i64 as f64` 精确转换
# 归 G2（2026-11-07 已恢复，本条按当前 pin 待复验）；`ArrayList<f64>` 返回值 demarshal 归 G3。
micro walk(root: [i64], index: usize, depth: usize, mut sums: ArrayList<f64>, mut counts: ArrayList<i64>) -> unit {
    if index >= root.length() {
        return
    }
    while sums.length() <= depth {
        sums.push(0)
        counts.push(0)
    }
    sums⁅depth⁆ = sums⁅depth⁆ + (root⁅index⁆ as f64)
    counts⁅depth⁆ = counts⁅depth⁆ + 1
    walk(root, 2 * index + 1, depth + 1, sums, counts)
    walk(root, 2 * index + 2, depth + 1, sums, counts)
}

[export(case: "camelCase")]
micro averageOfLevels(root: [i64]) -> [f64] {
    let mut sums: ArrayList<f64> = ArrayList::new(0)
    let mut counts: ArrayList<i64> = ArrayList::new(0)
    walk(root, 0, 0, sums, counts)
    let mut answer: ArrayList<f64> = ArrayList::new(sums.length())
    let mut index: usize = 0
    while index < sums.length() {
        answer.push(sums⁅index⁆ / (counts⁅index⁆ as f64))
        index = index + 1
    }
    return answer.to_array()
}

class Solution {
    micro averageOfLevels(self, root: [i64]): [f64] {
        return averageOfLevels(root)
    }
}
