namespace leetcode.reverse_vowels_of_a_string;

# 阻塞：wasm 未绑定 `core::primitive::__u16_add`。`std.adaptor.wasm` 的 `math/unsigned.v` 明确声明
# u8/u16 保持未绑定、必须结构化失败；`utf8` 入口闭包会拉入 `char`/`Utf8Text` 的 u16 算术，
# 故 `legion build` 报 Planner(HostProviderCapabilityMissing)。入口合同之外仍需 std 上游演进。

[export(case: "camelCase")]
micro reverse_vowels(s: utf8) -> utf8 {
    let mut chars: ArrayList<char> = ArrayList::new(s.length())
    let mut i: usize = 0
    while i < s.length() {
        chars.push(s.char_at(i).unwrap())
        i = i + 1
    }
    let mut left: usize = 0
    let mut right: usize = chars.length()
    if right > 0 {
        right = right - 1
    }
    while left < right {
        while left < right && !chars⁅left⁆.unwrap().is_ascii_vowel() {
            left = left + 1
        }
        while left < right && !chars⁅right⁆.unwrap().is_ascii_vowel() {
            right = right - 1
        }
        if left < right {
            let tmp: char = chars⁅left⁆.unwrap()
            chars⁅left⁆ = chars⁅right⁆.unwrap()
            chars⁅right⁆ = tmp
            left = left + 1
            right = right - 1
        }
    }
    let mut builder: Utf8Builder = Utf8Builder::new(chars.length() + 1)
    let mut k: usize = 0
    while k < chars.length() {
        builder.append(chars⁅k⁆.unwrap())
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro reverseVowels(self, s: utf8): utf8 {
        return reverse_vowels(s)
    }
}
