namespace leetcode.find_the_original_array_of_prefix_xor;

using std.collection;

# 前缀异或还原：answer[0] = pref[0]，answer[i] = pref[i] ^ pref[i - 1]。
# 迭代器侧没有 zip / scan，成对相邻元素只能以索引循环表达（未命中面，见账本）。
[export(case: "camelCase")]
micro find_array(pref: [i64]) -> [i64] {
    let count: usize = pref.length()
    let mut result: ArrayList<i64> = ArrayList::new(count)
    if count == 0 {
        return result.to_array()
    }

    result.push(pref⁅0⁆)
    let mut i: usize = 1
    while i < count {
        result.push(pref⁅i⁆ ^ pref⁅i - 1⁆)
        i = i + 1
    }
    return result.to_array()
}

class Solution {
    micro findArray(self, pref: [i64]): [i64] {
        return find_array(pref)
    }
}
