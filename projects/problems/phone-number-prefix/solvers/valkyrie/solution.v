namespace leetcode.phone_number_prefix;

using std.collection;

# 按字典序排序后检查相邻两串：若后一串以排序后的前一串为前缀，则存在前缀关系。
# 字典序由 `Utf8Text` 的 `Comparable` 合同提供，经 `natural_order` 转成比较器。
micro compare_text(left: utf8, right: utf8) -> i32 {
    return natural_order(left, right)
}

[export(case: "camelCase")]
micro phonePrefix(numbers: ArrayList<utf8>) -> bool {
    let mut ordered: ArrayList<utf8> = sorted_by(numbers, compare_text)
    let mut i: usize = 1
    while i < ordered.length() {
        let previous: utf8 = ordered⁅i - 1⁆
        let current: utf8 = ordered⁅i⁆
        if current.starts_with(previous) {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro phonePrefix(self, numbers: ArrayList<utf8>): bool {
        return phonePrefix(numbers)
    }
}
