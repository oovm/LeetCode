namespace leetcode.valid_anagram;

# 阻塞：四 lane 同阻——`调用实例 ItemInstanceId(...) 没有定义或显式导入合同`，callers 为
# `std::insert` 与 `std::find_slot`。`HashMap` 的插入/查找实例缺声明或显式导入合同，不是 provider 缺失。

[export(case: "camelCase")]
micro is_anagram(s: utf8, t: utf8) -> bool {
    if s.length() != t.length() {
        return false
    }
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < s.length() {
        let ch: char = s⁅i⁆
        let code: u32 = ch as u32
        let key: i64 = code as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        i = i + 1
    }
    let mut k: usize = 0
    while k < t.length() {
        let ch: char = t⁅k⁆
        let code: u32 = ch as u32
        let key: i64 = code as i64
        let mut left: i64 = 0
        if counts.contains_key(key) {
            left = counts.get(key).unwrap()
        }
        if left == 0 {
            return false
        }
        counts.insert(key, left - 1)
        k = k + 1
    }
    return true
}

class Solution {
    micro isAnagram(self, s: utf8, t: utf8): bool {
        return is_anagram(s, t)
    }
}
