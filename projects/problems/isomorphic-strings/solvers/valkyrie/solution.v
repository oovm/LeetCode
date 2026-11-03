namespace leetcode.isomorphic_strings;

# 双向映射同步校验，O(n)
[export(case: "camelCase")]
micro is_isomorphic(s: utf8, t: utf8) -> bool {
    # 参考解只扫描 s，t 多出的后缀不参与映射
    if s.length() > t.length() {
        return false
    }
    let mut forward: HashMap<i64, i64> = HashMap::new(0)
    let mut backward: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < s.length() {
        let a: i64 = s⁅i⁆ as u32 as i64
        let b: i64 = t⁅i⁆ as u32 as i64
        if forward.contains_key(a) {
            if forward.get(a).unwrap() != b {
                return false
            }
        } else {
            forward.insert(a, b)
        }
        if backward.contains_key(b) {
            if backward.get(b).unwrap() != a {
                return false
            }
        } else {
            backward.insert(b, a)
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isIsomorphic(self, s: utf8, t: utf8): bool {
        return is_isomorphic(s, t)
    }
}
