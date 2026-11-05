namespace leetcode.construct_the_lexicographically_largest_valid_sequence;

using std.collection;

# 回填骨架：path 长度 2n，数字 v 占用一个或两个位置；从 n 到 1 贪心回填。
# 这里刻意使用递归（place 自调用）验证 V 的递归深度与 ArrayList 引用语义。
micro place(path: ArrayList<i64>, used: ArrayList<i64>, value: i64, position: usize) -> bool {
    let size: usize = (value * 2) as usize
    if position == size {
        return true
    }
    if path⁅position⁆ != 0 {
        return place(path, used, value, position + 1)
    }

    let mut candidate: i64 = value
    while candidate >= 2 {
        let span: usize = candidate as usize
        if used⁅span⁆ > 0 && position + span < size && path⁅position + span⁆ == 0 {
            used⁅span⁆ = 0
            path⁅position⁆ = candidate
            path⁅position + span⁆ = candidate
            if place(path, used, value, position + 1) {
                return true
            }
            path⁅position⁆ = 0
            path⁅position + span⁆ = 0
            used⁅span⁆ = 2
        }
        candidate = candidate - 1
    }

    if used⁅1⁆ > 0 {
        used⁅1⁆ = 0
        path⁅position⁆ = 1
        if place(path, used, value, position + 1) {
            return true
        }
        path⁅position⁆ = 0
        used⁅1⁆ = 1
    }
    return false
}

[export(case: "camelCase")]
micro constructDistancedSequence(n: i64) -> ArrayList<i64> {
    let size: usize = (n * 2) as usize
    let mut path: ArrayList<i64> = ArrayList::new(size)
    let mut flags: ArrayList<i64> = ArrayList::new(size)
    let mut index: usize = 0
    while index < size {
        path.push(0)
        index = index + 1
    }
    index = 0
    while index < size {
        flags.push(2)
        index = index + 1
    }
    flags⁅1⁆ = 1

    place(path, flags, n, 1)

    let mut result: ArrayList<i64> = ArrayList::new(size - 1)
    index = 1
    while index < size {
        result.push(path⁅index⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro constructDistancedSequence(self, n: i64): ArrayList<i64> {
        return constructDistancedSequence(n)
    }
}
