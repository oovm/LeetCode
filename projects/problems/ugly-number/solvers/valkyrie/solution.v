namespace leetcode.ugly_number;

[export(case: "camelCase")]
micro is_ugly(n: i64) -> bool {
    if n <= 0 {
        return false
    }
    let mut value: i64 = n
    while value % 2 == 0 {
        value = value / 2
    }
    while value % 3 == 0 {
        value = value / 3
    }
    while value % 5 == 0 {
        value = value / 5
    }
    return value == 1
}

class Solution {
    micro isUgly(self, n: i64): bool {
        return is_ugly(n)
    }
}
