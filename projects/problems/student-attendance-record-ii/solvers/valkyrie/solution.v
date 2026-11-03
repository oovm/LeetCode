namespace leetcode.student_attendance_record_ii;

# 六状态滚动 DP：a∈{0,1} 缺席数 × l∈{0,1,2} 末尾连 L 数。
[export(case: "camelCase")]
micro check_record(n: i64) -> i64 {
    let m: i64 = 1000000007
    let mut a0l0: i64 = 1
    let mut a0l1: i64 = 0
    let mut a0l2: i64 = 0
    let mut a1l0: i64 = 0
    let mut a1l1: i64 = 0
    let mut a1l2: i64 = 0
    let mut i: i64 = 0
    while i < n {
        let n00: i64 = (a0l0 + a0l1 + a0l2) % m
        let n01: i64 = a0l0
        let n02: i64 = a0l1
        let n10: i64 = (n00 + a1l0 + a1l1 + a1l2) % m
        let n11: i64 = a1l0
        let n12: i64 = a1l1
        a0l0 = n00
        a0l1 = n01
        a0l2 = n02
        a1l0 = n10
        a1l1 = n11
        a1l2 = n12
        i = i + 1
    }
    return (a0l0 + a0l1 + a0l2 + a1l0 + a1l1 + a1l2) % m
}

class Solution {
    micro checkRecord(self, n: i64): i64 {
        return check_record(n)
    }
}
