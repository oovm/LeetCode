namespace leetcode.strobogrammatic_number;

# 旋转 180 度后的对应数字，非法字符返回 -1
micro mirror_digit(code: u32) -> i64 {
    if code == 48 || code == 49 || code == 56 {
        return code as i64
    }
    if code == 54 {
        return 57
    }
    if code == 57 {
        return 54
    }
    return -1
}

# 双指针对位校验，O(n)
[export(case: "camelCase")]
micro is_strobogrammatic(num: utf8) -> bool {
    let n: usize = num.length()
    let mut i: usize = 0
    while i <= n / 2 {
        let left: u32 = num⁅i⁆ as u32
        let right: u32 = num⁅n - 1 - i⁆ as u32
        let mirrored: i64 = mirror_digit(left)
        if mirrored < 0 {
            return false
        }
        if mirrored != right as i64 {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isStrobogrammatic(self, num: utf8): bool {
        return is_strobogrammatic(num)
    }
}
