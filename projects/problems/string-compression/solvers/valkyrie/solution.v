namespace leetcode.string_compression;

using std.collection;

# 原地双指针 + 写侧 `array_view`：读指针按段扫描，写指针只通过 `window` 交回底层数组。
# 数字段先由 `Utf8Builder::append_i64` 生成，再按 `slice(k, 1)` 逐位写回：
# `[utf8]` 的元素是「单字符串」，不能直接塞 `char`，这层类型缝必须显式转换。
# 这题同时压 `Utf8Builder`、`slice(start, 1)` 与 `[utf8]` 写侧三面。
[export(case: "camelCase")]
micro compress(mut chars: [utf8]) -> i64 {
    let count: usize = chars.length()
    let mut window: ArrayView<utf8> = array_view(chars)

    let mut write_at: usize = 0
    let mut read: usize = 0
    while read < count {
        let current: utf8 = chars⁅read⁆
        let mut end: usize = read
        while end < count && chars⁅end⁆ == current {
            end = end + 1
        }

        window⁅write_at⁆ = current
        write_at = write_at + 1

        let run: i64 = (end - read) as i64
        if run > 1 {
            let mut digits: Utf8Builder = Utf8Builder::new(1)
            digits.append_i64(run)
            let text: utf8 = digits.build()
            let mut k: usize = 0
            while k < text.length() {
                window⁅write_at⁆ = text.slice(k, 1)
                write_at = write_at + 1
                k = k + 1
            }
        }
        read = end
    }
    return write_at as i64
}

class Solution {
    micro compress(mut self, chars: [utf8]): i64 {
        return compress(chars)
    }
}
