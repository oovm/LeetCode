namespace leetcode.reverse_string;

# 阻塞：四 lane 崩溃（进程退出码 `-1073740791`，无结构化 JSON 行）。`ArrayList::at` 泛型返回槽在 wasm
# 规划为 anyref、编码按 i32 发射，触发 `callers` 断言 `WASM 编码结果与预规划槽冲突: %5 in std::at`。

[export(case: "camelCase")]
micro reverse_string(mut s: ArrayList<utf8>) -> unit {
    let mut i: usize = 0
    let mut j: usize = s.length()
    if j > 0 {
        j = j - 1
    }
    while i < j {
        let tmp: utf8 = s⁅i⁆.unwrap()
        s⁅i⁆ = s⁅j⁆.unwrap()
        s⁅j⁆ = tmp
        i = i + 1
        j = j - 1
    }
}

class Solution {
    micro reverseString(mut self, s: ArrayList<utf8>): unit {
        reverse_string(s)
    }
}
