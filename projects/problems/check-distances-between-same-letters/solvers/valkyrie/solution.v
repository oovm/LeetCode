namespace leetcode.check_distances_between_same_letters;

using std.collection;

# 记录每个字母首次出现的下标；第二次出现时校验间隔与 distance 一致。
[export(case: "camelCase")]
micro checkDistances(s: utf8, distance: ArrayList<i64>) -> bool {
    let mut first: ArrayList<i64> = ArrayList::new(26)
    let mut slot: usize = 0
    while slot < 26 {
        first.push(-1)
        slot = slot + 1
    }
    let mut index: usize = 0
    while index < s.length() {
        let letter: i64 = (s⁅index⁆ as u32) as i64 - 97
        let seen: i64 = first⁅letter as usize⁆
        if seen < 0 {
            first⁅letter as usize⁆ = index as i64
        } else if index as i64 - seen - 1 != distance⁅letter as usize⁆ {
            return false
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro checkDistances(self, s: utf8, distance: ArrayList<i64>): bool {
        return checkDistances(s, distance)
    }
}
