namespace leetcode.print_binary_tree;

using std.collection;

# 输入是堆式层序数组（无空洞）。高度 h 决定矩阵为 h 行、2^h-1 列：
# 深度 d 的第 j 个节点落在列 j*2^(h-d) + 2^(h-d-1) - 1。总代价 O(n) 次写入。
micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

micro power_two(exponent: i64) -> i64 {
    let mut value: i64 = 1
    let mut step: i64 = 0
    while step < exponent {
        value = value * 2
        step = step + 1
    }
    return value
}

[export(case: "camelCase")]
micro print_tree(root: ArrayList<i64>) -> ArrayList<ArrayList<utf8>> {
    let total: i64 = root.length() as i64
    if total == 0 {
        let mut empty: ArrayList<ArrayList<utf8>> = ArrayList::new(0)
        return empty
    }
    let mut height: i64 = 1
    let mut capacity: i64 = 1
    while capacity < total {
        capacity = capacity * 2 + 1
        height = height + 1
    }
    let width: i64 = capacity

    let mut result: ArrayList<ArrayList<utf8>> = ArrayList::new(height as usize)
    let mut depth: i64 = 0
    while depth < height {
        let mut row: ArrayList<utf8> = ArrayList::new(width as usize)
        let mut column: i64 = 0
        while column < width {
            row.push(empty_text())
            column = column + 1
        }
        let step: i64 = power_two(height - depth)
        let offset: i64 = step / 2 - 1
        let first: i64 = power_two(depth) - 1
        let level_size: i64 = power_two(depth)
        let mut within: i64 = 0
        while within < level_size && first + within < total {
            let node: i64 = first + within
            let position: i64 = within * step + offset
            let mut builder: Utf8Builder = Utf8Builder::new(8)
            builder.append_i64(root⁅node as usize⁆)
            row⁅position as usize⁆ = builder.build()
            within = within + 1
        }
        result.push(row)
        depth = depth + 1
    }
    return result
}

class Solution {
    micro printTree(self, root: ArrayList<i64>): ArrayList<ArrayList<utf8>> {
        return print_tree(root)
    }
}
