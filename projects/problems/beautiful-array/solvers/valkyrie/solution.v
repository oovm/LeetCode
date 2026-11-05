namespace leetcode.beautiful_array;

using std.collection;

# 分治构造：左半映射成奇数、右半映射成偶数，保证「相邻两数差奇数」且整体无重复。
# 递归深度 O(log n)，总代价 O(n log n)。
micro build(size: i64) -> ArrayList<i64> {
    if size == 1 {
        let mut single: ArrayList<i64> = ArrayList::new(1)
        single.push(1)
        return single
    }
    let left: ArrayList<i64> = build((size + 1) / 2)
    let right: ArrayList<i64> = build(size / 2)
    let mut out: ArrayList<i64> = ArrayList::new(size as usize)
    let mut index: usize = 0
    while index < left.length() {
        out.push(left⁅index⁆ * 2 - 1)
        index = index + 1
    }
    let mut slot: usize = 0
    while slot < right.length() {
        out.push(right⁅slot⁆ * 2)
        slot = slot + 1
    }
    return out
}

[export(case: "camelCase")]
micro beautiful_array(n: i64) -> ArrayList<i64> {
    return build(n)
}

class Solution {
    micro beautifulArray(self, n: i64): ArrayList<i64> {
        return beautiful_array(n)
    }
}
