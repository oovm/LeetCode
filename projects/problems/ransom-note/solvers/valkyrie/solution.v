namespace leetcode.ransom_note;

# 阻塞：wasm 未绑定 `core::primitive::__u16_add`。`std.adaptor.wasm` 的 `math/unsigned.v` 明确声明
# u8/u16 保持未绑定、必须结构化失败；`utf8` 入口闭包会拉入 `char`/`Utf8Text` 的 u16 算术，
# 故 `legion build` 报 Planner(HostProviderCapabilityMissing)。入口合同之外仍需 std 上游演进。

[export(case: "camelCase")]
micro can_construct(ransomNote: utf8, magazine: utf8) -> bool {
    let mut counts: HashMap<i64, i64> = HashMap::new(0)
    let mut j: usize = 0
    while j < magazine.length() {
        let ch: char = magazine.char_at(j).unwrap()
        let code: u32 = ch as u32
        let key: i64 = code as i64
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        j = j + 1
    }
    let mut i: usize = 0
    while i < ransomNote.length() {
        let ch: char = ransomNote.char_at(i).unwrap()
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
        i = i + 1
    }
    return true
}

class Solution {
    micro canConstruct(self, ransomNote: utf8, magazine: utf8): bool {
        return can_construct(ransomNote, magazine)
    }
}
