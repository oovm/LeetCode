namespace leetcode.add_to_array_form_of_integer;

using std.collection;

# 大整数 limbs：`num` 已是十进制逐位承载，`k` 直接当初始进位，逐位加后自行进位。
# 不依赖任意精度类型（std 只到 i128 / u128，无需大整数即能表达）。
[export(case: "camelCase")]
micro add_to_array_form(num: [i64], k: i64) -> ArrayList<i64> {
    let mut digits: ArrayList<i64> = ArrayList::new(num.length() + 16)
    let mut i: i64 = num.length() as i64 - 1
    let mut carry: i64 = k
    while i >= 0 || carry > 0 {
        if i >= 0 {
            carry = carry + num⁅i as usize⁆
            i = i - 1
        }
        digits.push(carry % 10)
        carry = carry / 10
    }

    # G21：`ArrayList` 没有原地 `reverse`，`Iterator` 也没有 `rev`；
    # 低位先 push 的结果只能手写双指针反转回高位在前。
    let mut left: i64 = 0
    let mut right: i64 = digits.length() as i64 - 1
    while left < right {
        let tmp: i64 = digits⁅left as usize⁆
        digits⁅left as usize⁆ = digits⁅right as usize⁆
        digits⁅right as usize⁆ = tmp
        left = left + 1
        right = right - 1
    }
    return digits
}

class Solution {
    micro addToArrayForm(self, num: [i64], k: i64): ArrayList<i64> {
        return add_to_array_form(num, k)
    }
}
