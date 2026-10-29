namespace leetcode.reverse_string;

# 阻塞：wasm 未绑定 `core::primitive::__u8_add`。`std.adaptor.wasm` 的 `math/unsigned.v` 明确声明
# u8/u16 保持未绑定、必须结构化失败；`ArrayList<utf8>` 实例闭包会拉入 `Utf8Text` 的 u8 算术，
# 故 `legion build` 报 Planner(HostProviderCapabilityMissing)。入口合同之外仍需 std 上游演进。

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
