namespace leetcode.valid_anagram;

# 阻塞：wasm 未绑定 `core::primitive::__u16_add`。`std.adaptor.wasm` 的 `math/unsigned.v` 明确声明
# u8/u16 保持未绑定、必须结构化失败；`utf8` 入口闭包会拉入 `char`/`Utf8Text` 的 u16 算术，
# 故 `legion build` 报 Planner(HostProviderCapabilityMissing)。入口合同之外仍需 std 上游演进。

[export(case: "camelCase")]
micro is_anagram(s: utf8, t: utf8) -> bool {
    if s.length() != t.length() {
        return false
    }
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut i: usize = 0
    while i < s.length() {
        let ch: char = s.char_at(i).unwrap()
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
        let ch: char = t.char_at(k).unwrap()
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
